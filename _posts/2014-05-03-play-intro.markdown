---
title: Play 2 &lt;3s Devs
layout: post
---
I have just finished [James Hughes'](https://twitter.com/kouphax) tutorial for
the Java implementation of the Play framework. I found it useful, giving a
holistic view of the framework, without going into unnecessary details. This post
will outline my first impressions of the Play framework, from a developer's
perspective.

##What is Play? 
The Play framework is designed to make web development quicker and easier. It
enforces a strict MVC policy, sacrificing developer freedom on the alters of
maintainability and sanity. 

Play recognises that concurrency and scalability are fundamental to modern web 
development and is built on these foundations. Play is a framework that runs 
on the Java Virtual Machine and is implemented in both Scala and Java. It is 
the second iteration of the framework, which has been rewritten from a Java 
code base to Scala.

Don't worry, you don't need to know scala the only time it really pops up is
when templating which, lets face it, you would probably use a different language
for anyway.

##Notable features 
I'll not rewrite the website on this, but here are a few
things that I appreciated about Play:

###Hot deployment
Why waste precious time, having to move your cursor all the way
to 'run' button on your IDE or heaven forbid a terminal window - compile, deploy and run your code
before seeing the changes? Play takes all that pain away. It does as little work as
possible to deploy your changes, meaning a template change will appear instantly
whereas a configuration change will cause a recompile and deploy.

###Templating type safety
Play uses scala for templating. This means that each .scala.html file in the
views folder will be compiled as an object and can be called from Java giving
edit and compiler time validation of parameters passed into it. Below
is an example of calling the render function on a view which takes a String
message:

![Compiled view auto completing parameters]({{site.url}}/img/calling-compiled-view.png)

###Displaying errors in browser
Debugging is never pleasant, but Play does a good job at make it easy. Moving
away from hiding errors in the terminal. Play compiles the
most relevant information and gives you a nicely formatted screen so at a
glance you have a fair idea what you need to change to get it working
again. This is a prime example of how developers' needs have been prioritised in
creating this framework. 

![Play displaying a compiler error in the browser]({{site.url}}/img/browser-error.png)

##Pick & Mix
Like one of these features but aren't ready to submit to the authoritarian rule of a framework?
Here are light weight alternatives for specific features.

 1. [Hot deployment - SBT (Simple Build Tool)](http://www.scala-sbt.org/0.12.4/docs/Getting-Started/Running.html#continuous-build-and-test)  
    When you run commands like `play compile` or `play run` play is simply
acting as a wrapper around SBT. Hence the auto reloading behaviour exhibited in
Play is actually inherited from SBT

 2. [Template type safety - Scalate](http://scalate.fusesource.org/)  
    Play uses a custom version of Scalate which checks templates at edit/compile
time to ensure there are no errors in the page.

 3. [Nicely rendered error messages - Templating](https://github.com/playframework/playframework/tree/master/framework/src/play/src/main/scala/views/defaultpages)  
    Another really nice thing about Play from a Dev point of view is it's open source
    this is perfect for situations like this. We can dissect the way Play is handling
    errors and see the template they use to display them.

Well, there you have it. My Play framework feature highlight reel. I know there
are some very impressive features I've left out, especially around the Akka
actor model implementation but from a humble code building perspective these
were the things that made a difference to me.

If you want to know more about Play checkout:

- [The official website](http://www.playframework.com/)
- [Wikipedia](http://en.wikipedia.org/wiki/Play!_Framework)
- [Pluralsight training (membership
  required)](http://pluralsight.com/training/courses/TableOfContents?courseName=play-2-java&highlight=james-hughes_play-2-for-java-m1-introduction*3!james-hughes_play-2-for-java-m3-routing*4,6,5,7!james-hughes_play-2-for-java-m5-views*1!james-hughes_play-2-for-java-m2-starting-up*1,2#play-2-for-java-m1-introduction)
