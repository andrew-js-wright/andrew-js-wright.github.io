// address.js version 1.1  11-08-2013
// Copyright (c) 2009-2013 RJE-productions and E.R. van Veldhoven. All rights reserved. No part of this script may be published, in any form or by any means, without the prior permission of the author.
function address2()
{
var i=0;
var s=':'+'o'+'p'+'t'+'u'+'l'+'z'+'i'+'z'+'a'+'l'+'m'+'e';
var a='';
for (i=0;i<s.length;i++)
{
if(i%2==0)a=a+s.charAt(i);
else a=s.charAt(i)+a;
}
return(a);
}
function address(text)
{
var s='@';
document.write('<a href="'+address2()+s+'dse.nl">'+text+'</a>');
}
function addressmain(status,text)
{
var s='@';
document.write('<a href="'+address2()+s+'dse.nl" title="'+status+'" onMouseOver="window.status=\''+status+'\'; return true" onMouseOut="window.status=\'\'">');
document.write('<img src="images/mail.gif" width="45" height="52" align="middle" alt="'+status+'"></a>');
document.write(text+'<i>&nbsp;<a href="'+address2()+s+'dse.nl" title="'+status+'" onMouseOver="window.status=\''+status+'\'; return true" onMouseOut="window.status=\'\'">'+address2().substr(7)+s+'dse.nl</a></i>');
}
