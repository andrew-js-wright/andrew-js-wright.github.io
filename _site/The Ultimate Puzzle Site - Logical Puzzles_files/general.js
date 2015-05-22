// general.js version 2.0  09-09-2013
// Copyright (c) 2010-2013 RJE-productions and E.R. van Veldhoven. All rights reserved. No part of this script may be published, in any form or by any means, without the prior permission of the author.
function languageswitchto(language)
{
var a=location.href;
var ie=a.lastIndexOf(".html");
var iu=a.substr(0,ie).lastIndexOf("_");
if((iu>=0)&&(ie==iu+3))
{
a=a.substr(0,iu+1)+language+a.substr(ie);
location.href=a;
}
}
function getWindowWidth()
{
return window.innerWidth||document.documentElement.clientWidth||document.body.clientWidth;
}
function getWindowHeight()
{
return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight;
}
function getElement(id)
{
element=0;
if(document.getElementById)
{
element=document.getElementById(id);
}
else
if(document.all)
{
element=document.all[id];
}
return element;
}
function getPageNameFromPath(path)
{
var ie=path.lastIndexOf(".html");
var iu=path.substr(0,ie).lastIndexOf("_");
if((iu>=0)&&(ie==iu+3))
{
return path.substr(0,iu);
}
else
{
var iu=path.substr(0,ie).lastIndexOf("index");
if((iu>=0)&&(ie==iu+5))
{
return path.substr(0,ie);
}
else
{
return "";
}
}
}
function getPageName()
{
var pagename=getPageNameFromPath(location.pathname);
if((pagename=="")&&parent)pagename=getPageNameFromPath(parent.location.pathname);
return pagename;
}
