---
layout: post
---
#Introduction to the Play 2 framework for Java 
I have just finished [James Hughes'](https://twitter.com/kouphax) tutorial for
the Java implementation of the play framework. I found it useful, giving a
holistic view of the framework, without going into uneccessary details. This
blog post will cover what I, having a fleeting knowledge of Play,
find most helpful about the framework from a software development point of view.

##What is the Play framework? 
The Play framework is designed to make web development quicker and easier. It
uses the MVC model of application development giving you a lot of helpers when
implementing this for the web. The framework recognises that concurrency and
scalability are fundamental to modern web app development and is built with this
in mind. From template type safety to hot deployments, the framework is packed
with developer friendly features which take a lot of the meanial tasks out of
web development. Play is a framework that runs on the Java Virtual Machine and
is implemented in both Scala and Java. It is the second iteration of the
framework, which has been rewritten from a Java code base to Scala.

##Notable features 
I'll not rewrite the website on this, but here are a few
things that I appreciated about Play:

###Hot deployment
Ok, so not a feature unique to play but super handy. Basically you can tinker
with any part of the app, write another route for example, while the app is
running and when you reload the webpage - there it is. It's so intuitive,
make a change, and see the change. What's not to love?

###Templating type safety
Play uses scala for templating. This means that each .scala.html file in your
views folder will be compiled as an object and can be called from java giving
you edit and compiler time checking of types you're passing into it. Below
is an example of calling the render function on a view which takes a String
message:

![Compiled view auto completing parameters]({{site.url}}/img/calling-compiled-view.png)

###Displaying errors in browser
Debugging is never pleasant, but play does a good job at make it easy. Moving
away from hiding errors in the terminal where you have to note the file name and
line number before flicking over to your editor to chase it up. Play compiles the
most relevant information and gives you a nicely formatted screen so at a
glance you have a fair idea exactly what you need to change to get it working
again. This is a prime exmple of how developers' needs have been prioritised in
creating this framework. 

![Play displaying a compiler error in the browser]({{site.url}}/img/browser-error.png)

##Pick & Mix
Like one of these features but aren't sure if the full Play package is for you?
Here are light weight alternatives for specific features.

 1. [Hot deployment - SBT (Simple Build Tool)] (http://www.scala-sbt.org/0.12.4/docs/Getting-Started/Running.html#continuous-build-and-test)
    When you run commands like `play compile` or `play run` play is simply
acting as a wrapper around SBT. Hence the auto reloading behaviour exhibited in
play is actually inherited from SBT
 2. [Template type safety - Scalate] (http://scalate.fusesource.org/)
    Play uses a custom version of Scalate which checks templates at edit/compile
time to ensure there are no errors in the page.
 3. [Nice browser error messages] 
    I'm afraid this one isn't so easy, at least I couldn't find an easy library
for it. Play has created its own exception types and when the server returns an
error, it is passed into a [custom scala error template](https://github.com/playframework/playframework/tree/master/framework/src/play/src/main/scala/views/defaultpages).

Well, there you have it. My play framework feature highlight reel. I know there
are some very impressive features I've left out, especially around the Akka
actor model implementation but from a humble code building perspective these
were the things that made a difference to me.

If you want to know more about play checkout:

- [The offical website](http://www.playframework.com/)
- [Wikipedia](http://en.wikipedia.org/wiki/Play!_Framework)
- [Pluralsight training (membership
  required)](http://pluralsight.com/training/courses/TableOfContents?courseName=play-2-java&highlight=james-hughes_play-2-for-java-m1-introduction*3!james-hughes_play-2-for-java-m3-routing*4,6,5,7!james-hughes_play-2-for-java-m5-views*1!james-hughes_play-2-for-java-m2-starting-up*1,2#play-2-for-java-m1-introduction)
