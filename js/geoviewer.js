var gvWindowWidth, gvWindowHeight;

/*global document */
function changeSrc(newSrc) {
  'use strict';
  document.getElementById("contents").src=newSrc;
}

function displayMap() {
  'use strict';
  var wmsUrl = document.forms.frm1.selWms.attributes.url.value,
      x1 = document.forms.frm1.x1.value,
      x2 = document.forms.frm1.x2.value,
      y1 = document.forms.frm1.y1.value,
      y2 = document.forms.frm1.y2.value,
      layers = document.forms.frm1.layers.value,
      src = wmsUrl + "&LAYERS="+layers+"&FORMAT=image/png&SRS=EPSG:102067&STYLES=&BBOX=" +y1+ "," + x1 + "," + y2 + "," + x2 + "&WIDTH="+gvWindowWidth+"&HEIGHT="+svgElemHeight();
  changeSrc( src );
}

/*global clearLines */
/*global processScript */
function updateDisplay() {
  'use strict';
  var autoDisplay = document.getElementById("autoDisplay").checked;
  if (autoDisplay) {
    clearLines();
    displayMap();
    processScript();
  }
}

function preset(y1,x1,y2,x2) {
  'use strict';
  var frm1 = document.forms.frm1;
  frm1.x1.value = x1;
  frm1.x2.value = x2;
  frm1.y1.value = y1;
  frm1.y2.value = y2;
  updateDisplay();
}

function zoomIn() {
  'use strict';
  var oldX1 = parseFloat(document.forms.frm1.x1.value),
      oldY1 = parseFloat(document.forms.frm1.y1.value),
      oldX2 = parseFloat(document.forms.frm1.x2.value),
      oldY2 = parseFloat(document.forms.frm1.y2.value),
      height = oldX2 - oldX1,
      width = oldY2 - oldY1,
      newX1 = oldX1 + (height/4),
      newY1 = oldY1 + (width/4),
      newX2 = oldX2 - (height/4),
      newY2 = oldY2 - (width/4);
  preset(newY1, newX1, newY2, newX2);
}

function zoomOut() {
  'use strict';
  var oldX1 = parseFloat(document.forms.frm1.x1.value),
      oldY1 = parseFloat(document.forms.frm1.y1.value),
      oldX2 = parseFloat(document.forms.frm1.x2.value),
      oldY2 = parseFloat(document.forms.frm1.y2.value),
      height = oldX2 - oldX1,
      width = oldY2 - oldY1,
      newX1 = oldX1 - (height/4),
      newY1 = oldY1 - (width/4),
      newX2 = oldX2 + (height/4),
      newY2 = oldY2 + (width/4);
  preset(newY1, newX1, newY2, newX2);
}

function panWest() {
  'use strict';
  var oldX1 = parseFloat(document.forms.frm1.x1.value),
      oldY1 = parseFloat(document.forms.frm1.y1.value),
      oldX2 = parseFloat(document.forms.frm1.x2.value),
      oldY2 = parseFloat(document.forms.frm1.y2.value),
      width = oldY2 - oldY1,
      newX1 = oldX1,
      newY1 = oldY1 - (width/3),
      newX2 = oldX2,
      newY2 = oldY2 - (width/3);
  preset(newY1, newX1, newY2, newX2);
}

function panEast() {
  'use strict';
  var oldX1 = parseFloat(document.forms.frm1.x1.value),
      oldY1 = parseFloat(document.forms.frm1.y1.value),
      oldX2 = parseFloat(document.forms.frm1.x2.value),
      oldY2 = parseFloat(document.forms.frm1.y2.value),
      width = oldY2 - oldY1,
      newX1 = oldX1,
      newY1 = oldY1 + (width/3),
      newX2 = oldX2,
      newY2 = oldY2 + (width/3);
  preset(newY1, newX1, newY2, newX2);
}

function panNorth() {
  'use strict';
  var oldX1 = parseFloat(document.forms.frm1.x1.value),
      oldY1 = parseFloat(document.forms.frm1.y1.value),
      oldX2 = parseFloat(document.forms.frm1.x2.value),
      oldY2 = parseFloat(document.forms.frm1.y2.value),
      height = oldX2 - oldX1,
      newX1 = oldX1 + (height/3),
      newY1 = oldY1,
      newX2 = oldX2 + (height/3),
      newY2 = oldY2;
  preset(newY1, newX1, newY2, newX2);
}

function panSouth() {
  'use strict';
  var oldX1 = parseFloat(document.forms.frm1.x1.value),
      oldY1 = parseFloat(document.forms.frm1.y1.value),
      oldX2 = parseFloat(document.forms.frm1.x2.value),
      oldY2 = parseFloat(document.forms.frm1.y2.value),
      height = oldX2 - oldX1,
      newX1 = oldX1 - (height/3),
      newY1 = oldY1,
      newX2 = oldX2 - (height/3),
      newY2 = oldY2;
  preset(newY1, newX1, newY2, newX2);
}

function calculateMBR() {
  'use strict';
  var coordinates = processScriptToCoordinates(),
      y1=coordinates[0].oy1,
      y2=coordinates[0].oy2,
      x1=coordinates[0].ox1,
      x2=coordinates[0].ox2,
      xMax, xMin, yMax, yMin,
      coord;
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
  $("#y1")[0].value=-x2;
  $("#y2")[0].value=-x1;
  $("#x1")[0].value=-y2;
  $("#x2")[0].value=-y1;
  clearLines();
  displayMap();
  processScript();
}

///////////////////////////////////////////////////////////////////

/*global $ */
/*global presets */
function populatePresets() {
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
function populateWMSs() {
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

function onChangePreset() {
  'use strict';
  var selectedOption = this.selectedOptions[0].attributes;
  preset( selectedOption.y1.value, selectedOption.x1.value, selectedOption.y2.value, selectedOption.x2.value );
}

function onChangeWms() {
  'use strict';
  var selectedOption = this.selectedOptions[0].attributes;
  this.setAttribute("url",selectedOption.url.value);
  $("#layers")[0].value = wms[this.selectedIndex].layers;
  if ($("#selPresets")[0].selectedIndex > 0) {
    updateDisplay();
  }
}

function svgElemHeight() {
  return gvWindowHeight - 27;
}

/*global gvWindowWidth*/
/*global gvWindowHeight*/
function geoViewerResize() {
  'use strict';
  var svgElem = $('#svgbasics'),
      imgElem = $('#contents');
  gvWindowWidth = window.innerWidth;
  gvWindowHeight = window.innerHeight;
  //console.log('resized - width:'+gvWindowWidth+', height:'+gvWindowHeight);
  svgElem.width( gvWindowWidth );
  svgElem.find('svg').width( gvWindowWidth );
  svgElem.height( svgElemHeight() );
  svgElem.find('svg').height( svgElemHeight() );
  imgElem.width( gvWindowWidth );
  imgElem.height( svgElemHeight() );
  updateDisplay();
}

function geoViewerInit() {
  'use strict';
  populatePresets();
  var sel = $("#selPresets"),
      selWms = $("#selWms");
  // register event for Presets
  sel.change( onChangePreset );

  populateWMSs();
  // register event for WMSs
  selWms.change( onChangeWms );
  selWms.attr("url",$("#selWms option:first").attr("url"));
  $("#layers")[0].value = wms[0].layers;

  geoViewerResize();
  $(window).resize(geoViewerResize);
}

function switchToOpenStreetMap() {
  $("#gvOsm").show();
  $("#gvOsm").height(780);
  $("#gvWms").hide();
  $("#gvWmsControls").hide();
  map.invalidateSize();
}

function switchToWms() {
  $("#gvOsm").hide();
  $("#gvOsm").height(0);
  $("#gvWms").show();
  $("#gvWmsControls").show();
}

//////////////////////////////////////////////////////////////////////////////////////
$(function() {
  'use strict';
  $('#svgbasics').svg({onLoad: drawInitial});
  $('#drawLines').click(processScript);
  $('#mbr').click(calculateMBR);
  $('#clear').click(clearLines);
  $('#export').click(function() {
    var xml = $('#svgbasics').svg('get').toSVG();
    $('#svgexport').html(xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
  });
  $("#svgbasics").offset($("#contents").offset());

  $("#switchGvOsm").click(switchToOpenStreetMap);
  $("#switchGvWms").click(switchToWms);
});
