/*global $*/
/*global lastsx */
/*global lastsy */
var lastsx = 0,
    lastsy = 0,
    lastox = 0,
    lastoy = 0,
    currentColor = "red",
    currentWidth = 1;

function resetSize(svg, width, height) {
  'use strict';
  svg.configure({width: width || $(svg._container).width(),
    height: height || $(svg._container).height()});
}

function clearLines() {
  'use strict';
  $('#svgbasics').svg('get').clear();
}

function drawInitial(svg) {
  'use strict';
  svg.circle(75, 75, 50, {fill: 'none', stroke: 'red', 'stroke-width': 3});
  var g = svg.group({stroke: 'black', 'stroke-width': 2});
  svg.line(g, 15, 75, 135, 75);
  svg.line(g, 75, 15, 75, 135);
}

var colours = ['purple', 'red', 'orange', 'yellow', 'lime', 'green', 'blue', 'navy', 'black'];

function transformHoriz( x, g ) {
  'use strict';
  if (Math.abs(x) < 430000) {
    return x;  // no transformation
  }
  var rawsx = ((Math.abs(x)-Math.abs(g.gxr))/g.dx*1000);
  return 1000-rawsx;
}

function transformVert( y, g ) {
  'use strict';
  if (Math.abs(y) < 910000) {
    return y;  // no transformation
  }
  var rawsy = (Math.abs(y)-Math.abs(g.gyt))/g.dy*700;
  return rawsy;
}

function extractHoriz( coo ) {
  'use strict';
  var cooHoriz = Math.min(Math.abs(coo[0]),Math.abs(coo[1]));
  if (cooHoriz > 500000000) {
    return cooHoriz/1000;
  }
  return cooHoriz;
}

function extractVert( coo ) {
  'use strict';
  var cooVert = Math.max(Math.abs(coo[0]),Math.abs(coo[1])); 
  if (cooVert > 910000000) {
    return cooVert/1000;
  }
  return cooVert;
}

function isEven( n ) { 
  'use strict';
  return ((n%2) === 0); 
}

/*function gatherWorldCoordinatesFromScript( script ) {
  'use strict';
  var worldCoordinates = [];
  return worldCoordinates;
}*/

function isNumber( ch ) {
  'use strict';
  return ch.search(/\d/) >= 0;
}

function processPointLine(currentLine, coordinates) {
  'use strict';
  var coords = currentLine.split(/[ ,\)]+/),
      c1 = [ 1*coords[0], 1*coords[1] ],
      x1 = transformHoriz(extractHoriz(c1)),
      y1 = transformVert(extractVert(c1));
  coordinates.push({x1: x1, y1: y1, color: currentColor, strokeWidth: currentWidth, type: 'point'});
  lastsx = sx1;
  lastsy = sy1;
}

function processRectangleLine(currentLine, coordinates) {
  'use strict';
  var coords = currentLine.split(/[ ,\)]+/);
  var c1 = [ 1*coords[0], 1*coords[1] ];
  var c2 = [ 1*coords[2], 1*coords[3] ];
  var sx1 = transformHoriz(extractHoriz(c1));
  var sy1 = transformVert(extractVert(c1));
  var sx2 = transformHoriz(extractHoriz(c2));
  var sy2 = transformVert(extractVert(c2));
  var x1 = Math.min(sx1,sx2);
  var y1 = Math.min(sy1,sy2);
  var x2 = Math.max(sx1,sx2);
  var y2 = Math.max(sy1,sy2);
  var swidth=x2-x1;
  var sheight=y2-y1;
  coordinates.push({x1: x1, y1: y1, width: swidth, height: sheight, color: currentColor, strokeWidth: currentWidth, type: 'rect'});
  lastsx = sx2;
  lastsy = sy2;
}

function processCoordinatesLine(currentLine, coordinates, g) {
  'use strict';
  var coords = currentLine.split(/[ ,\)<]+/),
      c1, c2, ox1, oy1, ox2, oy2, sx1, sy1, sx2, sy2;
  if (coords.length > 3) {
    c1 = [ 1*coords[0], 1*coords[1] ];
    c2 = [ 1*coords[2], 1*coords[3] ];
    ox1 = extractHoriz(c1);
    oy1 = extractVert(c1);
    ox2 = extractHoriz(c2);
    oy2 = extractVert(c2);
    sx1 = transformHoriz(ox1,g);
    sy1 = transformVert(oy1,g);
    sx2 = transformHoriz(ox2,g);
    sy2 = transformVert(oy2,g);
    coordinates.push({x1: sx1, y1: sy1, x2: sx2, y2: sy2, 
                                  ox1: ox1, oy1: oy1, ox2: ox2, oy2: oy2, 
          color: currentColor, strokeWidth: currentWidth, 
          type: 'line'});
    lastox = ox2;
    lastoy = oy2;
    lastsx = sx2;
    lastsy = sy2;
  } else if (coords.length == 2) {
    c2 = [ 1*coords[0], 1*coords[1] ];
    ox2 = extractHoriz(c2);
    oy2 = extractVert(c2);
    sx2 = transformHoriz(ox2,g);
    sy2 = transformVert(oy2,g);
    try {
      coordinates.push({x1: lastsx, y1: lastsy, x2: sx2, y2: sy2, 
                       ox1: ox1, oy1: oy1, ox2: ox2, oy2: oy2, 
                       color: currentColor, strokeWidth: currentWidth, 
                       type: 'line'});
    } catch(err) {} // Pokémon
    lastox = ox2;
    lastoy = oy2;
    lastsx = sx2;
    lastsy = sy2;
  }
  if (coords.length > 4) {
    for (var coord in coords) {
      if (coord>3 && isEven(coord) && (coords[coord] != "")) {
        c2 = [ 1*coords[coord], 1*coords[1*coord+1] ];
        ox2 = extractHoriz(c2);
        oy2 = extractVert(c2);
        sx2 = transformHoriz(ox2,g);
        sy2 = transformVert(oy2,g);
        coordinates.push({x1: lastsx, y1: lastsy, x2: sx2, y2: sy2, 
                          ox1: lastox, oy1: lastoy, ox2: ox2, oy2: oy2, 
                          color: currentColor, strokeWidth: currentWidth, 
                          type: 'line'});
        lastox = ox2;
        lastoy = oy2;
        lastsx = sx2;
        lastsy = sy2;
      }
    }
  }
}

function processCommandLine(currentLine, coordinates) {
  'use strict';
  var lineParts = currentLine.split(" "),
      command = lineParts[0],
      args = [];
  for (var part in lineParts) {
    if (part>0) {
      args.push(lineParts[part]);
    }
  }
  if (command == "color") {
    currentColor = args[0];
  }
  if (command == "width") {
    currentWidth = args[0];
  }
  if (command == "text") {
    textValue = args[0];
    textX = transformHoriz(extractHoriz([args[1],args[2]]));
    textY = transformVert(extractVert([args[1],args[2]]));
    coordinates.push({x1: textX, y1: textY, text: textValue, color: currentColor, strokeWidth: currentWidth, type: 'text'});
  }
}

var SDO_POINT_PATT="MDSYS.SDO_GEOMETRY(2001,NULL,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,1,1),MDSYS.SDO_ORDINATE_ARRAY(";
var SDO_LINE_PATT ="MDSYS.SDO_GEOMETRY(2002,NULL,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),MDSYS.SDO_ORDINATE_ARRAY(";
var SDO_RECT_PATT ="MDSYS.SDO_GEOMETRY(2003,NULL,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,1003,3),MDSYS.SDO_ORDINATE_ARRAY(";

function processScriptLine(currentLine, coordinates, g) {
  'use strict';
  var line = "",
      geomType="";
  if (currentLine != "") {
    geomType = "line";  // default
    if (currentLine.substr(0,92) == SDO_POINT_PATT) {
      line = currentLine.substr(92);
      geomType = "point"
    } else if (currentLine.substr(0,92) == SDO_LINE_PATT) {
      line = currentLine.substr(92);
    } else if (/posList/.test(currentLine)) {
      line = currentLine.match(/posList>.*</)[0].substr(8,currentLine.length)
    } else if (currentLine.substr(0,95) == SDO_RECT_PATT) {
      line = currentLine.substr(95);
      geomType = "rect";
    } else if (currentLine.substr(0,4) == "rect") {
      line = currentLine.substr(5);
      geomType = "rect";
    } else {
      line = currentLine;
    }
    var firstChar = line.charAt(0);
    if (isNumber(firstChar)) {
      if (geomType == "line") {
        processCoordinatesLine(line, coordinates, g);
      } else if (geomType == "point") {
        processPointLine(line, coordinates, g);
      } else {
        processRectangleLine(line, coordinates, g);
      }
    } else {
      processCommandLine(line, coordinates);
    }
  }
}

function processScriptToCoordinates() {
  'use strict';
  var myScript = $('#myScript')[0].value;
  var scriptLines = myScript.split("\n");
  var coordinates = [];
  var gxl = 1 * $("#y1")[0].value;
  var gxr = 1 * $("#y2")[0].value;
  var dx = gxr - gxl;
  var gyb = 1 * $("#x1")[0].value;
  var gyt = 1 * $("#x2")[0].value;
  var dy = gyt - gyb,
      currentLine;
  lastsx = 0;
  lastsy = 0;
  currentColor = "red";
  currentWidth = 1;
  for (var line in scriptLines) {
    currentLine = scriptLines[line].trim();
    processScriptLine(currentLine,coordinates,{gxr:gxr, gyt:gyt, dx:dx, dy:dy});
  }
  return coordinates;
}

function calculateMBR() {
  'use strict';
  var coordinates = processScriptToCoordinates(),
      y1=coordinates[0].oy1,
      y2=coordinates[0].oy2,
      x1=coordinates[0].ox1,
      x2=coordinates[0].ox2,
      xMax, xMin, yMax, yMin;
  for (var coord in coordinates) {
    xMax = Math.max(coordinates[coord].ox1,coordinates[coord].ox2);
    xMin = Math.min(coordinates[coord].ox1,coordinates[coord].ox2);
    yMax = Math.max(coordinates[coord].oy1,coordinates[coord].oy2);
    yMin = Math.min(coordinates[coord].oy1,coordinates[coord].oy2);
    if (x1 > xMax) x1=xMax;
    if (x2 < xMin) x2=xMin;
    if (y1 > yMax) y1=yMax;
    if (y2 < yMin) y2=yMin;
  }
  $("#y1")[0].value=-x2;
  $("#y2")[0].value=-x1;
  $("#x1")[0].value=-y2;
  $("#x2")[0].value=-y1;
  clearLines();
  displayMap();
  processScript();
}

function processScript() {
  'use strict';
  var start = new Date().getMilliseconds();
  var coordinates = processScriptToCoordinates();
  drawSVGLines( coordinates );
  var end = new Date().getMilliseconds();
  var time = end - start;
  var messagesSpan = $('#messages')[0];
  messagesSpan.innerHTML = "elapsed time (ms): "+time
}

function drawSVGLines( coordinates ) {
  'use strict';
  var svg = $('#svgbasics').svg('get'),
      lc;
  for (var lineCoords in coordinates) {
    lc = coordinates[lineCoords];
    if (lc.type == 'line') {
      svg.line(lc.x1, lc.y1, lc.x2, lc.y2, {stroke: lc.color, 'stroke-width': lc.strokeWidth});
    } else if (lc.type == 'rect') {
      svg.rect(lc.x1, lc.y1, lc.width, lc.height, {fill: 'none',stroke: lc.color, 'stroke-width': lc.strokeWidth});
    } else if (lc.type == 'point') {
      svg.line(lc.x1-15, lc.y1, lc.x1+15, lc.y1, {stroke: lc.color, 'stroke-width': lc.strokeWidth});
      svg.line(lc.x1, lc.y1-15, lc.x1, lc.y1+15, {stroke: lc.color, 'stroke-width': lc.strokeWidth});
    } else {
      svg.text(null, lc.x1, lc.y1, lc.text, {stroke: lc.color, 'stroke-width': lc.strokeWidth});
    }
  }
}

function drawShape() {
  'use strict';
  var shape = this.id;
  var svg = $('#svgbasics').svg('get');
  if (shape == 'rect') {
    svg.rect(random(300), random(200), random(100) + 100, random(100) + 100,
      {fill: colours[random(9)], stroke: colours[random(9)],
      'stroke-width': random(5) + 1});
  }
  else if (shape == 'line') {
    svg.line(random(400), random(300), random(400), random(300),
      {stroke: colours[random(9)], 'stroke-width': random(5) + 1});
  }
  else if (shape == 'circle') {
    svg.circle(random(300) + 50, random(200) + 50, random(80) + 20,
      {fill: colours[random(9)], stroke: colours[random(9)],
      'stroke-width': random(5) + 1});
  }
  else if (shape == 'ellipse') {
    svg.ellipse(random(300) + 50, random(200) + 50, random(80) + 20, random(80) + 20,
      {fill: colours[random(9)], stroke: colours[random(9)],
      'stroke-width': random(5) + 1});
  }
}

function random(range) {
  'use strict';
  return Math.floor(Math.random() * range);
}

$(function() {
  'use strict';
  $('#svgbasics').svg({onLoad: drawInitial});
  $('#rect,#line,#circle,#ellipse').click(drawShape);
  $('#drawLines').click(processScript);
  $('#mbr').click(calculateMBR);
  $('#clear').click(clearLines);
  $('#export').click(function() {
    var xml = $('#svgbasics').svg('get').toSVG();
    $('#svgexport').html(xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
  });
  $("#svgbasics").offset($("#contents").offset())
});
