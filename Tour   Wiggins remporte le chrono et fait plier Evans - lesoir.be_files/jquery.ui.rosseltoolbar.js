//app_path="http://pdf.lesoir.be/toolbar/module/";
app_path="http://www.lesoir.be/modules/toolbar/module/";
var ross = (function($) {
	
	$.widget("ui.rosseltoolbar", {
		options: {
			location: "top",
			type: "nologo"
		},
		
		_create: function() {
			var self = this,
				o = self.options,
				el = self.element;
			
			// Get the content of the toolbar
			$.getJSON("/toolbar/module/toolbarJSON.php?cbk=?", { target: window.location.href }, function(data) {
			
				this.data = data;
			   
				buildToolbar(el,data);

				if ( $.browser.msie) {
  					setTimeout('initToolbar()',0);
				}
				else {
					initToolbar();
				}
			});
		}
	});

	buildToolbar = function(el,data){
	
	// Add all the element
	var toolbar = el;
	$('#rtb').wrapInner('<div id="wrap-toolbar">');
	$('#wrap-toolbar').wrapInner('<div id="toolbar">');
	$('#toolbar').wrapInner('<ul id="entries">');
	$('#toolbar').append('<div id="tool-right">');
	
	for (var item in data.items) {
		
		// Create a a element
		var pos = '';
		var contents = '';
		var loc = '';
		var llk = '';
		var ppk = '';
		if(data.items[item].clazz) pos = 'class="' + data.items[item].clazz + '" ';
		if(data.items[item].location == "extern") loc = 'target="_blank" ';
		if(data.items[item].logo)  contents = '<img src="' + data.items[item].logo + '" />';
		else contents = data.items[item].label;
		
		llk = data.items[item].ll;
		ppk = data.items[item].pp;
		
		if(!ppk) $('#entries').append('<li id="' + data.items[item].id + '" ' + pos + '><a ' + pos +' href="' + llk + '" alt="' + llk + '" title="' + data.items[item].description + '" ' + loc + ' class="' + data.items[item].id + '">' + contents + '</a></li>');
		else $('#' + ppk).append('<li class="subM '+data.items[item].clazz+'"><a id="' + data.items[item].id + '" href="' + llk + '" alt="' + llk + '" title="' + data.items[item].description + '" ' + loc + '>' + contents + '</a></li>');

	}
	$('.subM').wrapAll('<ul />');
	var pseudo = '';
	if(window.location.href.indexOf("forums")>=0){pseudo="p=1&";}
	if(!(typeof data.user === 'undefined')&&(data.user.indexOf("Visiteur")>=0||data.user.indexOf("unknown")>=0))data.user="";
	if(data.mode == "unauthenticated") $('#tool-right').wrapInner('<div id="ident"><a href="javascript:openConnect()" class="connected colorbox">Je me connecte</a><ul><li><a href="http://pdf.lesoir.be/mon_profil/register.php?aff=FULL&'+ pseudo +'backurlPDF='+encodeURIComponent(window.location.href)+'">Je m\'inscris</a></li></ul></div><div id="encart-newsletter"></div><div id="une-abo"><a href="http://pdf.lesoir.be/"><img height="500" width="350" src="http://www.lesoir.be/modules/pdf/cache/front_lesoir.jpg" alt="Aperçu de la une"></a></div>'  + data.iframe);
	else $('#tool-right').wrapInner('<div id="ident"><a href="'+ data.profil +'" class="disconnected colorbox">Bonjour <strong>' + data.user + '</strong></a><ul><li><a href="'+ data.profil +'">Voir mon profil</a></li><li><a href="http://pdf.lesoir.be/mon_profil/?action=abos">G&eacute;rer mes abonnements</a></li><li><a href="/simplesaml/sso_logout.php?url='+encodeURIComponent(window.location.href)+'">Se d&eacute;connecter</a></li></ul></div><div id="encart-newsletter"></div><div id="une-abo"><a href="http://pdf.lesoir.be/"><img height="500" width="350" src="http://www.lesoir.be/modules/pdf/cache/front_lesoir.jpg" alt="Aperçu de la une"></a></div>');
}
}) (jQuery);
