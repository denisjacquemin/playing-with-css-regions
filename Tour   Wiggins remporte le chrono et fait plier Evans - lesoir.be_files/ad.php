prlctrl = "&ctr=1341921027";
refererurl="";
if (refererurl=="") {
  refererurl=document.URL;
}
if (refererurl!="") {
function GCpurl_131220781398(t) {
	var dc=document.cookie,i,i2,co="-";
    	t+="=";
    	i=dc.indexOf(t);
    	if (i > -1) {
        	i2=dc.indexOf(";",i);
        	if (i2 < 0) i2=dc.length;
        	co=unescape(dc.substring( (i+(t.length)),i2));
    	}
    	return ""+co;
}
tagstring = "";
pageid = "";
purldim = "";
if (typeof(adpurl_dim) != "undefined") {
  purldim = '&dim=' + adpurl_dim;
} 
purldim = '&dim=298.170.1.2';var mycookie = this.GCpurl_131220781398("__adpurl_131220781398");
       		//alert(mycookie);
var track_visit_ipua = 0;
var track_visitorunic = 0;
var track_pvm_ipua = 1;
if(mycookie=="") {
	      track_visit_ipua=1;
        track_visitorunic=1;
} else {
    	var cook_array = mycookie.split("|");
    	if (cook_array[0]=="2012-07-10") {
    		if ((1341921027 - cook_array[1])>1800) {
    			track_visit_ipua = 1;
    		}
    	}
    	else {
    		track_visit_ipua = 1;
    		track_visitorunic = 1;
    	}
}

var mytrack = track_pvm_ipua + track_visit_ipua + track_visitorunic;

var d=document.domain;
if(d.substring(0,4)=='www.') d=d.substring(4,d.length);
ut=' expires=Sun, 18 Jan 2038 00:00:00 GMT;';
document.cookie='__adpurl_131220781398=2012-07-10|1341921027; path=/;'+ut+' domain='+d+';';

skipclic_1312207813985227 = '';


//if (navigator.appName=="Microsoft Internet Explorer") {
  document.write('<div id="adpurl_1312207813985227" style="display:none;"></div>');
//} else {
//  var purl_texte = '<div id="adpurl_1312207813985227" style="display:none;"></div>';
//  document.getElementById("adpurl_alternative_1").InnerHTML=purl_texte;
//}

purlfirst=0;

function SqueereHTTP1312207813985227(url, instance) {
   this.loaded = false;
   this.url=url;
   this.script;
   this.firstparam=true;
   this.serverResponse;
   this.instance=instance;
   that=this;
   this.AddParam = function(p, v) {
      if (that.firstparam) {
         that.url+='?'+p+'='+v;
         that.firstparam=false;
      } else {
         that.url+='&'+p+'='+v;
      }
   }
   this.Request1312207813985227 = function(force) {
          document.write("<scr"+"ipt type=\"text/javascript\" src=\""+url+"\"></scr"+"ipt>");
       }
   this.onComplete13122078139829817012 = function(css, serverResponse) { }
   this.onLoad = function() {
      if (that.loaded) { return; }
      that.loaded=true;
   };
   return this;
} 





function DisplayOnComplete13122078139829817012(css, serverResponse, skip) {
          if (css!='null') {
        document.write("<link type=\"text/css\" href=\""+css+"\" rel=\"stylesheet\"></link>");
      }
      document.write('<div id="adpurl2_1312207813985227" class="adpurl_style_div_1" align="left" >');      document.write(serverResponse);
      document.write('</div>');          if (document.getElementById('adpurl_1312207813985227')) document.getElementById('adpurl_1312207813985227').style.display='';
      purlfirst=1;
      urlrefresh1312207813985227=urlbase1312207813985227 + '?skip=' + skip + '&' + urlquery01312207813985227;
      myReq_1312207813985227 = SqueereHTTP1312207813985227(urlrefresh1312207813985227, 'myReq_1312207813985227');
} 

  function DisplayOneMoreManual13122078139829817012() {
        topelement=document.getElementById('13122078139829817012_1').innerHTML;
        purlindice=1;
        while (document.getElementById("13122078139829817012_" + (parseInt(purlindice)+1))) {
          temp = document.getElementById('13122078139829817012_' + (parseInt(purlindice)+1)).innerHTML;
          document.getElementById('13122078139829817012_' + purlindice).innerHTML=temp;
          purlindice++;
        }
        document.getElementById('13122078139829817012_' + purlindice).innerHTML=topelement;
  } 

  function DisplayOneMoreOnStart13122078139829817012(n) {
      for (ii=0; ii<n; ii++) {
        topelement=document.getElementById('13122078139829817012_1').innerHTML;
        purlindice=1;
        while (document.getElementById("13122078139829817012_" + (parseInt(purlindice)+1))) {
          temp = document.getElementById('13122078139829817012_' + (parseInt(purlindice)+1)).innerHTML;
          document.getElementById('13122078139829817012_' + purlindice).innerHTML=temp;
          purlindice++;
        }
        document.getElementById('13122078139829817012_' + purlindice).innerHTML=topelement;
      }
  } 

  function DisplayOneMore13122078139829817012(n) {
        //fadeOut_131220781398('adpurl_131220781398');
      for (ii=0; ii<n; ii++) {
        topelement=document.getElementById('13122078139829817012_1').innerHTML;
        purlindice=1;
        while (document.getElementById("13122078139829817012_" + (parseInt(purlindice)+1))) {
          temp = document.getElementById('13122078139829817012_' + (parseInt(purlindice)+1)).innerHTML;
          document.getElementById('13122078139829817012_' + purlindice).innerHTML=temp;
          purlindice++;
        }
        document.getElementById('13122078139829817012_' + purlindice).innerHTML=topelement;
      }
      setTimeout('DisplayOneMore13122078139829817012(' + n + ')',10000);
  } 
  function swap13122078139829817012() {
        var topelement = new Array;
        for (i=1; i<=1; i++) {
          topelement[i]=document.getElementById("13122078139829817012_" + (i)).innerHTML;
        }
        purlindice=1;
        while (document.getElementById("13122078139829817012_" + (parseInt(purlindice)+1))) {
          temp = document.getElementById("13122078139829817012_" + (purlindice+1)).innerHTML;
          document.getElementById("13122078139829817012_" + purlindice).innerHTML=temp;
          purlindice++;
        }
        for (i=1; i<=1; i++) {
          document.getElementById("13122078139829817012_" + (parseInt(purlindice - 1 + i))).innerHTML=topelement[i];
        }
        setTimeout('scrolling13122078139829817012()',10000);
  } 
  function scrolling13122078139829817012() {
        myObjfix = document.getElementById('conteneur13122078139829817012');
        yfix = myObjfix.offsetTop;
        myDiv1 = document.getElementById('13122078139829817012_1');
        myDiv2 = document.getElementById('13122078139829817012_2');
        //hmax=0;
        if(myDiv1.offsetHeight)          {hmax=myDiv1.offsetHeight;}
        else if(myDiv1.style.pixelHeight){hmax=myDiv1.style.pixelHeight;}
        myObj = document.getElementById('move13122078139829817012');
        ytemp = myObj.offsetTop;
        //alert('hmax=' + hmax + ', ytemp=' + ytemp);
        if (hmax + ytemp <= 0) {
            myObj.style.top="0px";
            swap13122078139829817012();
        }
        else {
            myObj.style.top= parseInt(ytemp) - 20 + "px";
            setTimeout('scrolling13122078139829817012()',50);
        }
  }

  function purlshow13122078139829817012() {
        purlindice=1;
        while (document.getElementById("13122078139829817012_" + (parseInt(purlindice)))) {
          temp = document.getElementById("13122078139829817012_" + (purlindice)).innerHTML;
          document.getElementById("13122078139829817012_" + purlindice).innerHTML="";
          document.getElementById("13122078139829817012_" + purlindice).innerHTML=temp;
          purlindice++;
        }
        myObj = document.getElementById('move13122078139829817012');
        myObj2 = document.getElementById('adpurl2_1312207813985227');
        if (myObj) myObj.style.top="0px";
        if (myObj2) myObj2.style.display="";
  } 


if (typeof(adpurl_already) == 'undefined') {
  function addEvent(obj, evType, fn){ 
    if (obj.addEventListener){ 
      obj.addEventListener(evType, fn, false); 
       return true; 
    } else if (obj.attachEvent){ 
      var r = obj.attachEvent("on"+evType, fn); 
      return r; 
    } else { 
      return false; 
    } 
  }
  adpurl_already = "y"; 
}

    if (document.getElementsByName("adpurl-keywords")) {
	     tagstring = '&tag=' + document.getElementsByName("adpurl-keywords").item(0).content;
    }
    else if (document.getElementById("adpurl-keywords")) {
	     tagstring = '&tag=' + document.getElementById("adpurl-keywords").content;
    }

    if (document.getElementById("adpurl-pageid")) {
	     pageid = '&pgid=' + document.getElementById("adpurl-pageid").content;
    }

    urlbase1312207813985227='http://adbox.rossel.be/php/displayad.php';
    urlquery01312207813985227='cpurl=0'+'.131220781398'+
          tagstring + pageid + purldim + '&ref=' + refererurl;
    urlquery11312207813985227='cpurl='+ mytrack +'.131220781398'+
          tagstring + pageid + prlctrl + purldim + '&ref=' + refererurl;
    url1312207813985227=urlbase1312207813985227 + '?' + skipclic_1312207813985227 + urlquery11312207813985227;

    myReq_1312207813985227 = new SqueereHTTP1312207813985227(url1312207813985227, 'myReq_1312207813985227');


function start1312207813985227() {
    //while (!document.getElementById("adpurl-keywords")) {}
    //myReq_1312207813985227 = new SqueereHTTP1312207813985227(url1312207813985227, 'myReq_1312207813985227');
    document.write("<scr"+"ipt type=\"text/javascript\" src=\""+url1312207813985227+"\"></scr"+"ipt>");
}

  document.write("<scr"+"ipt type=\"text/javascript\" src=\""+url1312207813985227+"\"></scr"+"ipt>");
  //start1312207813985227();
  //setTimeout('start1312207813985227()', 100);
  setTimeout('purlshow13122078139829817012()', 2000);
}
   
