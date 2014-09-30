function changeSrc( newSrc ) {
	document.getElementById("contents").src=newSrc;
}

function displayMap() {
	var wmsUrl = document.forms.frm1.selWms.attributes.url.value;
	var x1 = document.forms.frm1.x1.value;
	var x2 = document.forms.frm1.x2.value;
	var y1 = document.forms.frm1.y1.value;
	var y2 = document.forms.frm1.y2.value;
	var layers = document.forms.frm1.layers.value;
	var width = y1-y2
	var height = x1-x2
	var imgWidth = parseInt(700*width/height)
	//alert("imgWidth:"+imgWidth)
	//src = "http://wms.cuzk.cz/wms.asp?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS="+layers+"&FORMAT=image/png&SRS=EPSG:102067&STYLES=&BBOX=" +y1+ "," + x1 + "," + y2 + "," + x2 + "&WIDTH="+imgWidth+"&HEIGHT=700"
	//src = "http://wms.cuzk.cz/wms.asp?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS="+layers+"&FORMAT=image/png&SRS=EPSG:102067&STYLES=&BBOX=" +y1+ "," + x1 + "," + y2 + "," + x2 + "&WIDTH=1000&HEIGHT=700"
	//src = "http://services.cuzk.cz/wms/local-ux-wms.asp?service=WMS&version=1.3.0&request=getMap&CRS=EPSG:102066&LAYERS="+layers+"&FORMAT=image/png&SRS=EPSG:102067&STYLES=&BBOX=" +y1+ "," + x1 + "," + y2 + "," + x2 + "&WIDTH=1000&HEIGHT=700"
	var src = wmsUrl + "&LAYERS="+layers+"&FORMAT=image/png&SRS=EPSG:102067&STYLES=&BBOX=" +y1+ "," + x1 + "," + y2 + "," + x2 + "&WIDTH=1000&HEIGHT=700"
	changeSrc( src );
}

function preset(y1,x1,y2,x2) {
	document.forms.frm1.x1.value = x1;
	document.forms.frm1.x2.value = x2;
	document.forms.frm1.y1.value = y1;
	document.forms.frm1.y2.value = y2;
	autoDisplay = document.getElementById("autoDisplay").checked;
	if (autoDisplay) {
		clearLines();
		displayMap();
		processScript();
	}
}

function zoomIn() {
	oldX1 = 1 * document.forms.frm1.x1.value;
	oldY1 = 1 * document.forms.frm1.y1.value;
	oldX2 = 1 * document.forms.frm1.x2.value;
	oldY2 = 1 * document.forms.frm1.y2.value;
	height = oldX2 - oldX1;
	width = oldY2 - oldY1;
	newX1 = oldX1 + (height/4);
	newY1 = oldY1 + (width/4);
	newX2 = oldX2 - (height/4);
	newY2 = oldY2 - (width/4);
	preset(newY1, newX1, newY2, newX2);
}

function zoomOut() {
	oldX1 = 1 * document.forms.frm1.x1.value;
	oldY1 = 1 * document.forms.frm1.y1.value;
	oldX2 = 1 * document.forms.frm1.x2.value;
	oldY2 = 1 * document.forms.frm1.y2.value;
	height = oldX2 - oldX1;
	width = oldY2 - oldY1;
	newX1 = oldX1 - (height/4);
	newY1 = oldY1 - (width/4);
	newX2 = oldX2 + (height/4);
	newY2 = oldY2 + (width/4);
	preset(newY1, newX1, newY2, newX2);
}

function panWest() {
	oldX1 = 1 * document.forms.frm1.x1.value;
	oldY1 = 1 * document.forms.frm1.y1.value;
	oldX2 = 1 * document.forms.frm1.x2.value;
	oldY2 = 1 * document.forms.frm1.y2.value;
	height = oldX2 - oldX1;
	width = oldY2 - oldY1;
	newX1 = oldX1;
	newY1 = oldY1 - (width/3);
	newX2 = oldX2;
	newY2 = oldY2 - (width/3);
	preset(newY1, newX1, newY2, newX2);
}

function panEast() {
	oldX1 = 1 * document.forms.frm1.x1.value;
	oldY1 = 1 * document.forms.frm1.y1.value;
	oldX2 = 1 * document.forms.frm1.x2.value;
	oldY2 = 1 * document.forms.frm1.y2.value;
	height = oldX2 - oldX1;
	width = oldY2 - oldY1;
	newX1 = oldX1;
	newY1 = oldY1 + (width/3);
	newX2 = oldX2;
	newY2 = oldY2 + (width/3);
	preset(newY1, newX1, newY2, newX2);
}

function panNorth() {
	oldX1 = 1 * document.forms.frm1.x1.value;
	oldY1 = 1 * document.forms.frm1.y1.value;
	oldX2 = 1 * document.forms.frm1.x2.value;
	oldY2 = 1 * document.forms.frm1.y2.value;
	height = oldX2 - oldX1;
	width = oldY2 - oldY1;
	newX1 = oldX1 + (height/3);
	newY1 = oldY1;
	newX2 = oldX2 + (height/3);
	newY2 = oldY2;
	preset(newY1, newX1, newY2, newX2);
}

function panSouth() {
	oldX1 = 1 * document.forms.frm1.x1.value;
	oldY1 = 1 * document.forms.frm1.y1.value;
	oldX2 = 1 * document.forms.frm1.x2.value;
	oldY2 = 1 * document.forms.frm1.y2.value;
	height = oldX2 - oldX1;
	width = oldY2 - oldY1;
	newX1 = oldX1 - (height/3);
	newY1 = oldY1;
	newX2 = oldX2 - (height/3);
	newY2 = oldY2;
	preset(newY1, newX1, newY2, newX2);
}

///////////////////////////////////////////////////////////////////

function populatePresets() {
   var selPresets = $("#selPresets");
   presets.forEach( function(it, num) { 
	   var o = new Option(it.name, "preset_"+num); 
	   o.setAttribute("y1",it.y1);
	   o.setAttribute("x1",it.x1);
	   o.setAttribute("y2",it.y2);
	   o.setAttribute("x2",it.x2);
	   selPresets.append(o); 
   } )
}

function populateWMSs() {
   var selWms = $("#selWms");
   while (selWms.find("option").length>0) {
      selWms.find("option").remove(0);
   }
   wms.forEach( function(it, num) {
	   var o = new Option(it.name, "wms_"+num); 
	   o.setAttribute("url",it.url);
	   selWms.append(o); 
   } );
}


function geoViewerInit() {
   populatePresets();
   // register event for Presets
   var sel = $("#selPresets")
   sel.change( function() {
	   var selectedOption = sel.find("option[value='" +this.value+ "']")[0].attributes;
	   preset( selectedOption.y1.value, selectedOption.x1.value, selectedOption.y2.value, selectedOption.x2.value );
   } );

   populateWMSs();
   // register event for WMSs
   var selWms = $("#selWms");
   selWms.change( function() {
	   var selectedOption = selWms.find("option[value='" +this.value+ "']")[0].attributes;
	   selWms[0].setAttribute("url",selectedOption.url.value);
	   $("#layers")[0].value = wms[this.selectedIndex].layers;
	   //$("#layers")[0].value = wms.filter( function(it) { return (it.name == this.value); } );
   } );
   var firstOption = selWms.find("option")[0].attributes;
   selWms[0].setAttribute("url",firstOption.url.value);
   $("#layers")[0].value = wms[0].layers;
}
