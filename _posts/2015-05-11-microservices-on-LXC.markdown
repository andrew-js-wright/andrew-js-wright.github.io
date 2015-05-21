---
title: Microservices on LXC
layout: post
---
#Linux Containers on OSX

##Why
I want to explore Linx Containers and see how difficult it is to set up a sample microservice architecture using LXC. Identifying effort and limitations along the way.

[View source on github](https://github.com/andrew-js-wright/lxc-dropwizard-authentication-authorisation)

##Docker's LXC roots
[LXC](https://linuxcontainers.org/lxc/) is what [Docker](docker.io), the developer friendly containerisation platform, was originaly built on. It is a linux toolbox used for creating and managing containers on the linux kernal. There has been a lot of hype about docker and how simple it is to create a container on a developer's laptop and run it on a given production/test environment. Docker has made containerisation a piece of cake and abstracted all of details beneith it's shiny interface. Before I start exploring docker I wanted to understand containerisation on linux a little better hopefully sheading more light on what exactly Docker is bringing to the table and the situations where it might be more appropriate to use something a little closer to the metal.

#LXC case study
In order to understand LXC better I have decided to take Steven Alexander's [microsevice authentication and authorisation docker implementation](https://stevenwilliamalexander.wordpress.com/2015/05/11/microservice-authentication-and-authorisation-using-docker/) and port it to LXC. This is a great article and clearly outlines why containerisation can be useful and in particular why the microservice model lends itself to containerisation particularly well. I would encourage you to read this and Steven's related articles to understand how the java build process works and how his sample microservice archetecture fits together.

##Prerequisites
If you want to follow along with this post here are the tools you'll need:

- [Vagrant](http://www.vagrantup.com)
- [Gradle](http://gradle.org/)
- [Java 7](http://www.oracle.com/technetwork/java/javase/7u-relnotes-515228.html)

##Deployment process

Software developers have a bit of a reputation for not being overly concerned with what happens with their code after it's left their machine. I am sure that there are some developers for which this is true, however in my experience, with huge developer bias, the problem is quite often that developers feel that they lack the appropriate visability of the landscape to which their code is being deployed to. Developing against container helps to bring that land scape closer, allowing the developers to see first hand the hills and valleys their code will have to traverse in the wild. For me, this is the big reason why containers are so useful. The sooner the developer knows something won't work on the target OS the sooner they can fix it. Also, the more comfortable developers feel with the deployment process the more people can help out when things go wrong down stream with releases.

1. Local machine -> Container host (ubunut virtual machine)
2. Container host -> Container 
3. Execution within the container

To make sure everything's working the web server should be accessible from the local machine.

###Step 1: From local machine to container host

Vagrant has a nice clean interface for mount host directories onto a guest VM so that's what I'll use for this. If you look at the [Vagrantfile](https://github.com/andrew-js-wright/lxc-dropwizard-authentication-authorisation/blob/master/Vagrantfile) I'm using, you'll see it's booting a ubuntu trusty box (downloading the base image if it isn't installed already), sharing the [build output directory](https://github.com/andrew-js-wright/lxc-dropwizard-authentication-authorisation/tree/master/lxc) from the host and installing LXC. This can be done locally by running the following commands from the same directory as the vagrant file:

{% highlight console %}
local-machine> vagrant up
{% endhighlight %}

###Step 2: Deploy artifacts to containers

As part of the provisioning which is done by vagrant the containers are created, provisioned and the appropriate application files are copied across into each containers file system. I've broken this out into its own [bash script](TODO: GET URL FOR provision-dev.sh) for easy reference.

The lines of the provision script which we are concerned about here are as follows:

{% highlight bash %}
# Create our container called frontend
sudo lxc-create -t ubuntu -n frontend 

# Create a directory in the file system in the namespace of the frontend container
sudo mkdir /var/lib/lxc/frontend/rootfs/frontend

# Copy across the files we need to run the application
sudo cp /host/volume-frontend/* /var/lib/lxc/frontend/rootfs/frontend

# Start the container
sudo lxc-start -n frontend
{% endhighlight %}
Remember this is all run on the container host using vagrant.

In order to prove that we can access the application files from within the containers let dive inside and poke around.

{% highlight console %}
# Jump onto host VM which has been provisioned with vagrant
local-machine > vagrant ssh                                     

# Run a bash shell inside the running frontend container
vagrant@vagrant-ubuntu-trusty-64:~$ sudo lxc-attach -n frontend

# List the files in the frontend directory within the container
root@frontend:/# ls -l /frontend/
total 14132
-rw-r--r-- 1 root root      412 May 19 11:58 config.yml
-rw-r--r-- 1 root root 14464552 May 19 11:58 FrontendApplication.jar
{% endhighlight %}

Great, we've estabilished that we can get something that has been developed on a developers machine, onto an LXC container relatively painlessly. Now how do we make use of this? We still need to ensure the container has the required dependencies (i.e. the java run time environment) and we need to run our app.

###Step 3: Run applications on said containers

Provisioning of containers seems like a chunky topic which I don't want to dive into right as it would likley bring in more tooling to the mix so for this post I'm going to continue using the vagrant shell provisioner.

I want to update the current provisioning to do two more things:

1. Install JRE 1.7 on all required containers (more precisely build one and clone the rest from it)
2. Kick off the java process that will run the microservices

To do this I'm going to update the provision-dev.sh script that was introduced earlier to create the containers.

Ideally we'd be able to use the packages flag on the ubuntu template during container creation but there's a [bug open against it](https://github.com/lxc/lxc/issues/384) which will block us on that for now. This isn't a huge issue as we have the [lxc-attach](http://linux.die.net/man/1/lxc-attach) utility which allows us to run a command on a named container. We can hence install the java run time environment using the following command in our provision script:

{% highlight bash %}
# Use ubuntu's default package manager to install the JDK without asking for confirmation
sudo lxc-attach -n frontend -- sudo-apt-get install -y openjdk-7-jre
{% endhighlight %}

Now that our container has all of the dependencies that we need to run our app, lets have a look at making our frontend microservice run.
I'm going to use ubuntu's default task and services handler [upstart](http://upstart.ubuntu.com/) to manage the service. This gives us the benifit of being able to allow our service to run in the background being supervised by a robust manager which will restart the service if it dies and handle console output however we specify. To do this all we need is a configuration file following file at the location `/etc/init/frontend.conf` which will have the following contents:

{% highlight bash %}
# Frontends init script for upstart
start on filesystem and net-device-up IFACE!=lo
script
    java -jar /frontend/FrontendApplication.jar server /frontend/config.yml
end script
console none
respawn
{% endhighlight %}

We'll create this file in our mounted host directory and copy it across with another line in our provisioning script below:

{% highlight bash %}
# On the vagrant host copy the upstart configuration from the host system into the container init directory
sudo cp /host/frontend.conf /var/lib/lxc/frontend/rootfs/etc/init
{% endhighlight %}

We can test that our service is running on the container by running the following command on the vagrant host. If it returns one line then we've got a java process listening on the correct port.

{% highlight console %}
vagrant@vagrant-ubuntu-trusty-64:~$ sudo lxc-attach -n frontend -- netstat -plunt | grep java | grep :8081
tcp6       0      0 :::8081                 :::*                    LISTEN      765/java
{% endhighlight %}

Tada! We have successfully achieved our development pipeline, getting our code from our development machine to running on a container within a production like OS.

We now want to do the same for the rest of our services so they are all deployed in their own containers. Instead of creating brand new container we can simply clone the frontend container we made as it already has the required run time environment.

To do this we'll clone the container before we have move anything application specific onto it using the following commmands:

{% highlight bash %}
sudo lxc-clone -o frontend -n authorisation
sudo lxc-clone -o frontend -n authentication
sudo lxc-clone -o frontend -n person
sudo lxc-clone -o frontend -n session
{% endhighlight %}

Cloning is much quicker than creating a new container, taking around 15 seconds on a MacBook with 16 GB of RAM.

All of the micro service containers are basically the same, if you have a look in the [lxc/upstart](TODO) directory you'll see that I've basically copied the frontends start up script across and extended the [dev provision script](TODO) to copy across all of the required configuration files based on the frontend container. The outlier here is the web box which has a different set of dependencies and uses nginx to act as a reverse proxy, co-ordinating communication between the user and the underlying services. 

###The web container
Because the web container is a little different I felt it made sense to put it's provisioning in a [seperate script](TODO) to easily see what's going on.

In this script we'll create the container and install [openresty](http://openresty.org/) along with its dependencies. Note we can use [here-docs](http://tldp.org/LDP/abs/html/here-docs.html) to send mutliple lines to the lxc-attach utility.

{% highlight bash %}
sudo lxc-create -t ubuntu -n web
sudo lxc-start -n web

sudo lxc-attach -n web -- apt-get update
sudo lxc-attach -n web -- apt-get -y install libreadline-dev libncurses5-dev libpcre3-dev libssl-dev perl build-essential curl

sudo lxc-attach -n web -- << SCRIPT
    curl -0 http://openresty.org/download/ngx_openresty-1.7.10.1.tar.gz
    tar xzvf ngx_openresty-1.7.10.1.tar.gz
    cd ngx_openresty-1.7.10.1
    ./configure --with-luajit --with-http_gzip_static_module --with-http_ssl_module --with-pcre-jit
    make
    make install
    start web
SCRIPT
{% endhighlight %}

Even when we have all of our services deployed in their own containers. It won't be very useful unless they can talk to each other. So we'll take on networking next.

###Wiring containers together
By default when LXC creates a container it adds a virtual ethernet connection to a bridge on the host machine. This allows the host to access the container and visa versa. Lets ping a container from the vagrant host to prove that we can communicate with it.

{% highlight console %}
vagrant@vagrant-ubuntu-trusty-64:~$ ping -c 3 $(sudo lxc-info -n frontend -iH)
PING 10.0.3.108 (10.0.3.108) 56(84) bytes of data.
64 bytes from 10.0.3.108: icmp_seq=1 ttl=64 time=0.039 ms
64 bytes from 10.0.3.108: icmp_seq=2 ttl=64 time=0.085 ms
64 bytes from 10.0.3.108: icmp_seq=3 ttl=64 time=0.130 ms

--- 10.0.3.108 ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 2000ms
rtt min/avg/max/mdev = 0.039/0.084/0.130/0.038 ms
{% endhighlight %}

Note the nested [lxc-info](http://man7.org/linux/man-pages/man1/lxc-info.1.html) utility gives us a convienient way of accessing the container's IP address. It's one thing being able to ping the machine but in order to get any use out of the container we need to be able to connect to the service which it is running.

In this archetecture we are using the web container as a reverse proxy. This means that all other containers will need to know the IP address of the web box and it will need to know the address of all others. We'll use [hosts files](http://linux.die.net/man/5/hosts) to store the links between host names and IP addresses at the container level. 

We can propagate these as soon as we start the containers and the DHCP on the network bridge assigns each container with an IP address.

See the following section of the provision script:

{% highlight bash %}
# Network containers
# The web container need to have a mapping to all other containers
echo "$(sudo lxc-info -n frontend -iH) frontend" | sudo tee -a /var/lib/lxc/web/rootfs/etc/hosts
echo "$(sudo lxc-info -n authentication -iH) authentication" | sudo tee -a /var/lib/lxc/web/rootfs/etc/hosts
echo "$(sudo lxc-info -n session -iH) session" | sudo tee -a /var/lib/lxc/web/rootfs/etc/hosts

echo "$(sudo lxc-info -n authorisation -iH) authorisation" | sudo tee -a /var/lib/lxc/person/rootfs/etc/hosts
echo "$(sudo lxc-info -n person -iH) person" | sudo tee -a /var/lib/lxc/frontend/rootfs/etc/hosts
{% endhighlight %}

Once this has been run we can ping the frontend container from the web one as follows:

{% highlight console %}
vagrant@vagrant-ubuntu-trusty-64:~$ sudo lxc-attach -n web -- ping frontend -c 3
PING frontend (10.0.3.151) 56(84) bytes of data.
64 bytes from frontend (10.0.3.151): icmp_seq=1 ttl=64 time=0.141 ms
64 bytes from frontend (10.0.3.151): icmp_seq=2 ttl=64 time=0.096 ms
64 bytes from frontend (10.0.3.151): icmp_seq=3 ttl=64 time=0.106 ms

--- frontend ping statistics ---
3 packets transmitted, 3 received, 0% packet loss, time 1998ms
rtt min/avg/max/mdev = 0.096/0.114/0.141/0.021 ms
{% endhighlight %}

Lets try to hit the frontend service which is running on the frontend box from the web container now:

{% highlight console %}
vagrant@vagrant-ubuntu-trusty-64:~$ sudo lxc-attach -n web -- curl frontend:8081 | grep Persons
<h2><a href="/persons">View Persons</a></h2>
{% endhighlight %}
We have successfully established the link between the web container and the service running on the frontend container.

##Access from browser
So we have a fully operational system archetecture living inside our host vagrant machine. For developing web applications however, SSHing into a headless host to test functionality won't give us a very good idea of how we're getting on so lets allow the laptop to look inside the box.

As discussed above when lxc creates containers it puts them all onto a bridge which uses [NAT](http://en.wikipedia.org/wiki/Network_address_translation) to hide the underlying network from everything passed external to the host. This is kind of similar to how a home router hides inidividual devices from the internet. In the same way, if we want to expose a individual device (i.e. a container) to the wider network we will need to modify the router's (in this case the vagrant host machine's) firewall to forward requests to correct port.

In order to do this we want to add a port forwarding rule to the NAT table in the firewall. This will go in the PREROUTING section and ensure that any requests coming in on port 80 of the host get sent to the web container's port 8080. We can do this and verify that the firewall has been updated with the following commmands.

{% highlight console %}
vagrant@vagrant-ubuntu-trusty-64:~$ sudo iptables -t nat -A PREROUTING -i eth0 -p tcp --dport 80 -j DNAT --to $(sudo lxc-info -iH -n web):8080
vagrant@vagrant-ubuntu-trusty-64:~$ sudo iptables -t nat -L
Chain PREROUTING (policy ACCEPT)
target     prot opt source               destination
DNAT       tcp  --  anywhere             anywhere             tcp dpt:http to:10.0.3.126:8080

Chain INPUT (policy ACCEPT)
target     prot opt source               destination

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination

Chain POSTROUTING (policy ACCEPT)
target     prot opt source               destination
MASQUERADE  all  --  10.0.3.0/24         !10.0.3.0/24
{% endhighlight %}
