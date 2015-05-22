// bookmark.js version 1.3  27-02-2015
// Copyright (c) 2009 RJE-productions and E.R. van Veldhoven. All rights reserved. No part of this script may be published, in any form or by any means, without the prior permission of the author.
function addBookmarkTextCode(title,url,text,level)
{
var image="";
if (level==0) image='<img src="images/navicon2.jpg" width="32" height="32" alt="">';
else image='<img src="../images/navicon2.jpg" width="32" height="32" alt="">';
if ((typeof window.external=="object") && (typeof window.external.AddFavorite=="unknown"))
{
document.write('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+image+' <a href="javascript:window.external.AddFavorite(\''+url+'\',\''+title+'\')" title="'+text+'" onMouseOver="window.status=\''+text+'\'; return true" onMouseOut="window.status=\'\'"><span class="linksmall">'+text+'</span></a>');
}
else
if ((typeof window.sidebar=="object") && (typeof window.sidebar.addPanel=="function"))
{
document.write('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+image+' <a href="javascript:window.sidebar.addPanel(\''+title+'\',\''+url+'\',\'\')" title="'+text+'" onMouseOver="window.status=\''+text+'\'; return true" onMouseOut="window.status=\'\'"><span class="linksmall">'+text+'</span></a>');
}
else
{
document.write('&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;'+image+' <span class="linksmall">'+text+'</span>');
}
}
function addBookmarkText(language,level)
{
language=language.toLowerCase();
if(language=='de')addBookmarkTextCode('Die Ultimative Rätsel Site: on-line puzzeln und spielen!','http://puzzle.dse.nl/index_de.html','Füge diese Website zu deinen Lesezeichen oder Favoriten hinzu!',level);
if(language=='nl')addBookmarkTextCode('De Ultieme Puzzel Site: even lekker puzzelen!','http://puzzle.dse.nl','Voeg deze website toe aan je bladwijzers of favorieten!',level);
if(language=='us')addBookmarkTextCode('The Ultimate Puzzle Site','http://puzzle.dse.nl/index_us.html','Add this site to your bookmarks or favorites!',level);
}
