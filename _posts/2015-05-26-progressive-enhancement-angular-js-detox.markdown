---
title: Progressive Enhancement - My AngularJS Detox
layout: post 
tags:
- progressiveEnhancement
- javascript
- nojs 
- angularjs 
- angular
- jquery
--- 
I've been working on a pretty hefty web application for the passed two years
and I'm starting to think that we were doing it wrong.

#Angular Addiction
When I joined the project I had never developed an enterprise web application
before I was fresh out of university and had boots full of design pattern theory
and [SOLID](http://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29)
principles ready to hit the ground running. So going onto a project which was 
using [AngularJS]("https://angularjs.org")
with it's MVC programming model and easily testable founding principles seemed like
a dream. And it was. It was great - controllers were easily testable, services took
care of talking to a web service for persistence, views were templated out and had
very little logic. The world was good.

As a developer I could write code and unit tests using really interesting libraries
and ride the crest of the JavaScript hype wave. The entire frontend application was
thoroughly tested using unit tests and we, as a team, were pretty confident that 
it would serve us well out in the wild. 

#[We Built This City On JavaScript](https://www.youtube.com/watch?v=K1b8AhIsSYQ)
Everything remained pretty good until I read 
[this article](https://gds.blog.gov.uk/2013/10/21/how-many-people-are-missing-out-on-javascript-enhancement/) 
by Peter Herlihy. In it he suggests that as many as 1.1% of people aren't running
JavaScript and therefore wouldn't be able to access any part of a web application written
in AngularJS. I have often heard web developers write this off and
push the blame onto the users say things like "Well if they're not going to enable 
JavaScript they have to accept they can't use modern web apps". I get their point
and it's a reasonable one. I mean you can't expect to use all of the features of Google
maps, for example, without JavaScript. There is a certain onus on users if they want 
to be able to harness all of the power available to them.

On the other hand sometimes users choose to disable JavaScript for perfectly valid reasons
for example users who live in remote areas where network connectivity makes it impractical
for them to download all of the required JavaScript as it results in timeout errors. Another
reason could be accessibility, where a blind user's screen reader doesn't handle JavaScript
well.

As if that wasn't reason enough to support people who aren't running JavaScript 
Peter suggests that 0.9% of people have JavaScript enabled but still don't 
receive it. This can be for a whole host of reasons some of those suggested include:

- Corporate or local blocking or stripping of JavaScript elements
- Existing JavaScript errors in the browser (i.e. from browser add-ons, toolbars etc)
- Network errors, especially on mobile devices

#Going Cold Turkey
So we find ourselves in a position where we have built an application solely on JavaScript
and there are some fundamental pages which simply won't work without JavaScript because
the business area is so complex. So what do we do?

##Build What You Can Without JavaScript
It seems simple but it is an important precedent to set as early as possible. If everyone
is on board with including as many users as possible we should be doing as many user
journeys as possible without JavaScript and build JavaScript enhancements in to make 
the application more usable. Lets take a look at an example.

###Case Study
Lets say, for example, we are building an online assignment submission and grading application
which needs to have the following features:

- Authenticates users validating input
- Allows students to submit an assignment
- Teachers can use a JavaScript library to grade and annotate an assignment
- Students can view graded and annotated assignments using JavaScript library

It may seem like an obvious choice to use a JavaScript framework such as Angular because
we are already dependent on JavaScript. If we did this however we would needlessly
be excluding people who can't access JavaScript from submitting their assignments.

It is possible therefore to make a hybrid solution where we provide the base HTML and CSS to
implement the first two features and enhance them with JavaScript. For the second two
you would bootstrap your JavaScript application as normal when the user journey required it.

#Use Tools To Keep the Good Bits
##Web Frameworks
We obviously want to maintain the good programming practices we had in AngularJS and
the MVC model of separating concerns is available to us using a variety of server
side frameworks including [Spring MVC](https://spring.io/guides/gs/serving-web-content/) 
and the [Play Framework](https://www.playframework.com/). Server side code is also
more versed in the world of unit testing so there are loads of tools to help with 
ensuring you are able to maintain test-ability e.g. [JUnit](http://junit.org/).
