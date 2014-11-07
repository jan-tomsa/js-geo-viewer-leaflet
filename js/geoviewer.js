if (typeof GeoViewer == 'undefined') { GeoViewer = {}; }

GeoViewer.gvWindowWidth = 0;
GeoViewer.gvWindowHeight = 0;
GeoViewer.map = null;

/*global document */
GeoViewer.changeSrc = function(newSrc) {
  'use strict';
  document.getElementById("contents").src=newSrc;
}

GeoViewer.displayMap = function() {
  'use strict';
  var wmsUrl = document.forms.frm1.selWms.attributes.url.value,
      x1 = document.forms.frm1.x1.value,
      x2 = document.forms.frm1.x2.value,
      y1 = document.forms.frm1.y1.value,
      y2 = document.forms.frm1.y2.value,
      layers = document.forms.frm1.layers.value,
      src = wmsUrl + "&LAYERS="+layers+"&FORMAT=image/png&SRS=EPSG:102067&STYLES=&BBOX=" +y1+ "," + x1 + "," + y2 + "," + x2 + "&WIDTH="+GeoViewer.gvWindowWidth+"&HEIGHT="+GeoViewer.svgElemHeight();
  GeoViewer.changeSrc( src );
}

/*global clearLines */
/*global processScript */
GeoViewer.updateDisplay = function() {
  'use strict';
  var autoDisplay = document.getElementById("autoDisplay").checked;
  if (autoDisplay) {
    clearLines();
    GeoViewer.displayMap();
    processScript();
  }
}

GeoViewer.preset = function(y1,x1,y2,x2) {
  'use strict';
  var frm1 = document.forms.frm1;
  frm1.x1.value = x1;
  frm1.x2.value = x2;
  frm1.y1.value = y1;
  frm1.y2.value = y2;
  GeoViewer.updateDisplay();
}

GeoViewer.zoomIn = function() {
  'use strict';
    var frm1 = document.forms.frm1,
      oldX1 = parseFloat(frm1.x1.value),
      oldY1 = parseFloat(frm1.y1.value),
      oldX2 = parseFloat(frm1.x2.value),
      oldY2 = parseFloat(frm1.y2.value),
      height = oldX2 - oldX1,
      width = oldY2 - oldY1,
      newX1 = oldX1 + (height/4),
      newY1 = oldY1 + (width/4),
      newX2 = oldX2 - (height/4),
      newY2 = oldY2 - (width/4);
  GeoViewer.preset(newY1, newX1, newY2, newX2);
}

GeoViewer.zoomOut = function() {
  'use strict';
  var frm1 = document.forms.frm1,
      oldX1 = parseFloat(frm1.x1.value),
      oldY1 = parseFloat(frm1.y1.value),
      oldX2 = parseFloat(frm1.x2.value),
      oldY2 = parseFloat(frm1.y2.value),
      height = oldX2 - oldX1,
      width = oldY2 - oldY1,
      newX1 = oldX1 - (height/4),
      newY1 = oldY1 - (width/4),
      newX2 = oldX2 + (height/4),
      newY2 = oldY2 + (width/4);
  GeoViewer.preset(newY1, newX1, newY2, newX2);
}

GeoViewer.panWest = function() {
  'use strict';
    var frm1 = document.forms.frm1,
      oldX1 = parseFloat(frm1.x1.value),
      oldY1 = parseFloat(frm1.y1.value),
      oldX2 = parseFloat(frm1.x2.value),
      oldY2 = parseFloat(frm1.y2.value),
      width = oldY2 - oldY1,
      newX1 = oldX1,
      newY1 = oldY1 - (width/3),
      newX2 = oldX2,
      newY2 = oldY2 - (width/3);
  GeoViewer.preset(newY1, newX1, newY2, newX2);
}

GeoViewer.panEast = function() {
  'use strict';
    var frm1 = document.forms.frm1,
      oldX1 = parseFloat(frm1.x1.value),
      oldY1 = parseFloat(frm1.y1.value),
      oldX2 = parseFloat(frm1.x2.value),
      oldY2 = parseFloat(frm1.y2.value),
      width = oldY2 - oldY1,
      newX1 = oldX1,
      newY1 = oldY1 + (width/3),
      newX2 = oldX2,
      newY2 = oldY2 + (width/3);
  GeoViewer.preset(newY1, newX1, newY2, newX2);
}

GeoViewer.panNorth = function() {
  'use strict';
    var frm1 = document.forms.frm1,
      oldX1 = parseFloat(frm1.x1.value),
      oldY1 = parseFloat(frm1.y1.value),
      oldX2 = parseFloat(frm1.x2.value),
      oldY2 = parseFloat(frm1.y2.value),
      height = oldX2 - oldX1,
      newX1 = oldX1 + (height/3),
      newY1 = oldY1,
      newX2 = oldX2 + (height/3),
      newY2 = oldY2;
  GeoViewer.preset(newY1, newX1, newY2, newX2);
}

GeoViewer.panSouth = function() {
  'use strict';
    var frm1 = document.forms.frm1,
      oldX1 = parseFloat(frm1.x1.value),
      oldY1 = parseFloat(frm1.y1.value),
      oldX2 = parseFloat(frm1.x2.value),
      oldY2 = parseFloat(frm1.y2.value),
      height = oldX2 - oldX1,
      newX1 = oldX1 - (height/3),
      newY1 = oldY1,
      newX2 = oldX2 - (height/3),
      newY2 = oldY2;
  GeoViewer.preset(newY1, newX1, newY2, newX2);
}

/*global processScriptToCoordinates */
/*global console */
GeoViewer.calculateMBR = function() {
    'use strict';
    var coordinates = processScriptToCoordinates(),
        y1=coordinates[0].oy1,
        y2=coordinates[0].oy2,
        x1=coordinates[0].ox1,
        x2=coordinates[0].ox2,
        xMax, xMin, yMax, yMin,
        coord, resultingRectangle, rectWidth, rectHeight, aspHoriz, aspVert, aspRatio,
        horizCenter, vertCenter;
    for (coord in coordinates) {
        xMax = Math.max(coordinates[coord].ox1,coordinates[coord].ox2);
        xMin = Math.min(coordinates[coord].ox1,coordinates[coord].ox2);
        yMax = Math.max(coordinates[coord].oy1,coordinates[coord].oy2);
        yMin = Math.min(coordinates[coord].oy1,coordinates[coord].oy2);
        if (x1 > xMax) { x1=xMax; }
        if (x2 < xMin) { x2=xMin; }
        if (y1 > yMax) { y1=yMax; }
        if (y2 < yMin) { y2=yMin; }
    }
    resultingRectangle = {west: -x2,  east: -x1,  south: -y2,  north: -y1};
    rectWidth = resultingRectangle.east - resultingRectangle.west;
    rectHeight = resultingRectangle.north - resultingRectangle.south;
    // fix aspect ratio
    aspHoriz = GeoViewer.gvWindowWidth / rectWidth;
    aspVert  = GeoViewer.gvWindowHeight / rectHeight;
    aspRatio = aspHoriz / aspVert;
    horizCenter = resultingRectangle.east - (rectWidth / 2);
    vertCenter = resultingRectangle.north - (rectHeight / 2);
    if (aspRatio > 1.0) {
        console.log("Shrinking horizontally.");
        resultingRectangle.west = horizCenter - ((rectWidth / 2) * aspRatio);
        resultingRectangle.east = horizCenter + ((rectWidth / 2) * aspRatio);
    } else {
        console.log("Shrinking vertically.");
        resultingRectangle.south = vertCenter - ((rectHeight / 2) / aspRatio);
        resultingRectangle.north = vertCenter + ((rectHeight / 2) / aspRatio);
    }
    return {rect:resultingRectangle, center:{horiz:horizCenter, vert:vertCenter}};
}

GeoViewer.mbr = function() {
    'use strict';
    var wgs84center,
        ombr = GeoViewer.calculateMBR();
    $("#y1").val(ombr.rect.west);
    $("#y2").val(ombr.rect.east);
    $("#x1").val(ombr.rect.south);
    $("#x2").val(ombr.rect.north);
    clearLines();
    if ($("#gvWms").css("display") === "block") {
        GeoViewer.displayMap();
    }
    if ($("#gvOsm").css("display") === "block") {
        wgs84center = SJtsk2Wgs84.transformer.transform(Math.abs(ombr.center.vert),Math.abs(ombr.center.horiz));
        GeoViewer.map.panTo([wgs84center.lat,wgs84center.lng]);
    }
    processScript();
}

///////////////////////////////////////////////////////////////////

/*global $ */
/*global presets */
GeoViewer.populatePresets = function() {
    'use strict';
    var selPresets = $("#selPresets");
    presets.forEach( function(it, num) { 
        var o = new Option(it.name, "preset_"+num); 
        o.setAttribute("y1",it.y1);
        o.setAttribute("x1",it.x1);
        o.setAttribute("y2",it.y2);
        o.setAttribute("x2",it.x2);
        selPresets.append(o); 
    } );
}

/*global wms */
GeoViewer.populateWMSs = function() {
  'use strict';
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

GeoViewer.onChangePreset = function() {
  'use strict';
  var selectedOption = this.selectedOptions[0].attributes;
  GeoViewer.preset( selectedOption.y1.value, selectedOption.x1.value, selectedOption.y2.value, selectedOption.x2.value );
}

GeoViewer.onChangeWms = function() {
  'use strict';
  var selectedOption = this.selectedOptions[0].attributes;
  this.setAttribute("url",selectedOption.url.value);
  $("#layers").val(wms[this.selectedIndex].layers);
  if ($("#selPresets")[0].selectedIndex > 0) {
    GeoViewer.updateDisplay();
  }
}

GeoViewer.svgElemHeight = function() {
    'use strict';
    return GeoViewer.gvWindowHeight - 30;
}

GeoViewer.resize = function() {
  'use strict';
  var svgElem = $('#svgbasics'),
      imgElem = $('#contents'),
      $gvOsm = $("#gvOsm");
  GeoViewer.gvWindowWidth = window.innerWidth;
  GeoViewer.gvWindowHeight = window.innerHeight;
  //console.log('resized - width:'+GeoViewer.gvWindowWidth+', height:'+GeoViewer.gvWindowHeight);
  svgElem.width( GeoViewer.gvWindowWidth );
  svgElem.find('svg').width( GeoViewer.gvWindowWidth );
  svgElem.height( GeoViewer.svgElemHeight() );
  svgElem.find('svg').height( GeoViewer.svgElemHeight() );
  imgElem.width( GeoViewer.gvWindowWidth );
  imgElem.height( GeoViewer.svgElemHeight() );
  $gvOsm.height( GeoViewer.svgElemHeight() );
  $("#gvWms").height( GeoViewer.svgElemHeight() );
  GeoViewer.updateDisplay();
}

GeoViewer.init = function() {
  'use strict';
  var sel = $("#selPresets"),
      selWms = $("#selWms"),
      coordsRicany = [49.99,14.66],
      polygon;
  // register event for Presets
  sel.change( GeoViewer.onChangePreset );

  GeoViewer.map = L.map('gvOsm').setView(coordsRicany, 13); 
  L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', 
		  { attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>', maxZoom: 18, id: 'examples.map-i875mjb7' })
      .addTo(GeoViewer.map);

  GeoViewer.populatePresets();
  GeoViewer.populateWMSs();
  // register event for WMSs
  selWms.change( GeoViewer.onChangeWms );
  selWms.attr("url",selWms.find("option:first").attr("url"));
  $("#layers")[0].value = wms[0].layers;

  GeoViewer.resize();
  $(window).resize(GeoViewer.resize);
}

GeoViewer.switchToOpenStreetMap = function() {
    'use strict';
    var $gvOsm = $("#gvOsm");
    $gvOsm.show();
    $gvOsm.height( GeoViewer.svgElemHeight() );
    $("#gvWms").hide();
    $("#gvWmsControls").hide();
    GeoViewer.map.invalidateSize();
    $("#switchGvWms").attr("disabled",false);
    $("#switchGvOsm").attr("disabled",true);
}

GeoViewer.switchToWms = function() {
    'use strict';
    var $gvOsm = $("#gvOsm");
    $gvOsm.hide();
    $gvOsm.height(0);
    $("#gvWms").show();
    $("#gvWmsControls").show();
    $("#switchGvWms").attr("disabled",true);
    $("#switchGvOsm").attr("disabled",false);
}

