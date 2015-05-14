#Linux Containers on OSX

##Why
I want to explore Linx Containers and see how difficult it is to set up a sample microservice architecture using LXC. Identifying effort and limitations along the way.

[View source on github](https://github.com/andrew-js-wright/lxc-dropwizard-authentication-authorisation)

##Docker's LXC roots
[LXC](https://linuxcontainers.org/lxc/) is what [Docker](docker.io), the developer friendly containerisation platform, was originaly built on. It is a linux toolbox used for creating and managing containers on the linux kernal. There has been a lot of hype about docker and how simple it is to create a container on a developer's laptop and run it on a given production/test environment. Docker has made containerisation a piece of cake and abstracted all of details beneith it's shiny interface. Before I start exploring docker I wanted to understand containerisation on linux a little better hopefully shining more light on what exactly Docker is bringing to the table and the situations where it might be more appropriate to use something a little closer to the metal.

##LXC case study
In order to understand LXC better I have decided to take Steven Alexander's [microsevice authentication and authorisation docker implementation](https://stevenwilliamalexander.wordpress.com/2015/05/11/microservice-authentication-and-authorisation-using-docker/) and port it to LXC. This is a great article and clearly outlines why containerisation can be useful and in particular why the microservice model lends itself to containerisation particularly well. I would encourage you to read this and Steven's related articles to understand how the java build process works and how his sample microservice archetecture fits together.

###Prerequisites
If you want to follow along with this post here are the tools you'll need:
 - [Vagrant](http://www.vagrantup.com)
 - [Gradle](http://gradle.org/)
 - [Java 7](http://www.oracle.com/technetwork/java/javase/7u-relnotes-515228.html)

###Deployment process
To help us understand how this is going to work from a developers persepecitive, lets have a look at our local deployment process.

In order to develop against a production like environment (i.e. an evironment made up of LXC containers) we need to get our code built and running on containers. Because LXC requires linux kernal functionality I will need to run a linux VM on my machine which I will use to host the LXC containers. This means to deploy code on a developers machine (assuming they're all on OSX) will be a 3 step process:

1. Local machine -> Container host (ubunut virtual machine)
2. Container host -> Container 
3. Execution within the container

To make sure everything's working the web server should be accessible from the local machine.

####Step 1: From local machine to container host

Vagrant has a nice clean interface for mount host directories onto a guest VM so that's what I'll use for this. If you look at the [Vagrantfile](https://github.com/andrew-js-wright/lxc-dropwizard-authentication-authorisation/blob/master/Vagrantfile) I'm using, you'll see it's booting a ubuntu trusty box (downloading the base image if it isn't installed already), sharing the [build output directory](https://github.com/andrew-js-wright/lxc-dropwizard-authentication-authorisation/tree/master/lxc) from the host and installing LXC. This can be done locally by running the following commands from the same directory as the vagrant file:

```
vagrant up
```

####Step 2: Deploy artifacts to containers

As part of the provisioning which is done by vagrant the containers are created, provisioned and the appropriate application files are copied across into each containers file system. I've broken this out into its own [bash script](TODO: GET URL FOR dev-provision) for easy reference.

In order to prove that we can access the application files from within the containers let dive in side and poke around.

```
vagrant ssh                                     #this will bring us onto the host VM which has been provisioned with vagrant
sudo lxc-ls --fancy                             #this displays the list of boxes currenlty running
ssh ubuntu@<Frontend Container's IPv4 Address>  #ssh onto the container
ls -l /frontend                                 #this should display the application jar file and configuration
```

Great, we've estabilished that we can get something that has been developed on a developers machine, onto an LXC container relatively painlessly. Now how do we make use of this? We still need to ensure the container has the required dependencies (i.e. the java run time environment) and we need to run our app.

####Step 3: Run applications on said containers

Provisioning of containers seems like a chunky topic which I don't want to dive too deeply into right now as it means bringing more tooling into the mix so for this post I'm going to continue down the BASH & ssh route.

As part of the initial provisioning we're already doing I want to do two extra things here:

1. Install JRE 1.7 on all required containers (more precisely build one and clone the rest from it)
2. Kick off the java process that will run the microservices

To do this I'm going to update the dev_provision.sh script that was introduced earlier to create the containers.
Ideally we'd be able to use the packages flag on the ubuntu template during container creation but there's a [bug open against it](https://github.com/lxc/lxc/issues/384) which will block us on that for now. My second preferrence would be using [lxc-attach](http://linux.die.net/man/1/lxc-attach) which would mean that we wouldn't have to log onto the box before running a command Instead we'll hop onto the box over SSH, install what we need and kick off the required processes.
