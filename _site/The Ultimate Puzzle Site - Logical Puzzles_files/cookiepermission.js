// cookiepermission.js version 1.1  12-09-2013
// Copyright (c) 2013 RJE-productions and E.R. van Veldhoven. All rights reserved. No part of this script may be published, in any form or by any means, without the prior permission of the author.
function setCookie(name,value,expires)
{
var date=new Date();
date.setTime(date.getTime()+((expires||730)*86400000));
document.cookie=name+"="+encodeURIComponent(value)+"; expires="+date.toUTCString()+"; path=/;"
}
function setSessionCookie(name,value)
{
var date=new Date();
document.cookie=name+"="+encodeURIComponent(value)+"; path=/;"
}
function getCookie(name)
{
var reg=new RegExp(name+"=([^;$]+)","i");
var cookie=reg.exec(document.cookie);
return (cookie&&cookie[1])?decodeURIComponent(cookie[1]).trim():"";
}
function deleteCookie(name)
{
document.cookie=name+"=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/";
}
function setPermission()
{
setCookie("puzzlesite_nl_cookiepermission","yes");
deleteCookie("puzzlesite_nl_firstpage");
var layer=getElement("cookiemessage");
if(layer)
{
layer.style.visibility="hidden";
}
}
function onContinueClick()
{
setPermission();
setCookie("puzzlesite_nl_continueclicked","yes");
}
function checkCookiePermission()
{
var firstpage=getCookie("puzzlesite_nl_firstpage");
var pagename=getPageName();
if(!pagename||pagename.indexOf("cookiepolicy")!=-1)
{
pagename="";
}
if(getCookie("puzzlesite_nl_cookiepermission")!="yes")
{
if(pagename!="")
{
if(firstpage=="")
{
setSessionCookie("puzzlesite_nl_firstpage",pagename);
}
else
if(firstpage!=pagename)
{
setPermission();
}
}
}
}
function onLoad()
{
checkCookiePermission();
if(getCookie("puzzlesite_nl_cookiepermission")!="yes")
{
var layer=getElement("cookiemessage");
if(layer)
{
layer.style.visibility="visible";
}
}
if(additionalonload)
{
additionalonload.call();
}
}
function allowedAdsAndStats()
{
checkCookiePermission();
var pagename=getPageName();
if(pagename.indexOf("cookiepolicy")!=-1)
{
return(false);
}
setSessionCookie("puzzlesite_nl_cookietest","yes");
if(getCookie("puzzlesite_nl_cookietest")!="yes")
{
return(true);
}
if(getCookie("puzzlesite_nl_cookiepermission")=="yes")
{
return(true);
}
else return(false);
}
var additionalonload=0;
window.onload=onLoad;
