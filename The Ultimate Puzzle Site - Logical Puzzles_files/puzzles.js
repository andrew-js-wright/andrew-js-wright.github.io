// puzzles.js version 1.2  11-08-2013
// Copyright (c) 2006-2013 RJE-productions and E.R. van Veldhoven. All rights reserved. No part of this script may be published, in any form or by any means, without the prior permission of the author.
var puzimgdir="";
with (window.location)
{
puzimgdir=href.substring(0,href.lastIndexOf("/"));
puzimgdir=puzimgdir.substring(0,puzimgdir.lastIndexOf("/")+1)+"puzimg/";
}
function puzzle_img(img_name,width,height)
{
this.img=new Image(width,height);
this.img.src=puzimgdir+img_name;
}
function findpos(obj)
{
var curleft=curtop=0;
if(obj.offsetParent)
{
do
{
curleft+=obj.offsetLeft;
curtop+=obj.offsetTop;
}
while(obj=obj.offsetParent);
}
return[curleft,curtop];
}
