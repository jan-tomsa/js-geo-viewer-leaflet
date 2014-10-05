/*global $*/
/*global lastsx */
/*global lastsy */
/*global drawSVGLines */
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
      c1 = [ parseFloat(coords[0]), parseFloat(coords[1]) ],
      x1 = transformHoriz(extractHoriz(c1)),
      y1 = transformVert(extractVert(c1));
  coordinates.push({x1: x1, y1: y1, 
                    color: currentColor, strokeWidth: currentWidth, 
                    type: 'point'});
  lastsx = x1;
  lastsy = y1;
}

function processRectangleLine(currentLine, coordinates) {
  'use strict';
  var coords = currentLine.split(/[ ,\)]+/),
      c1 = [ parseFloat(coords[0]), parseFloat(coords[1]) ],
      c2 = [ parseFloat(coords[2]), parseFloat(coords[3]) ],
      sx1 = transformHoriz(extractHoriz(c1)),
      sy1 = transformVert(extractVert(c1)),
      sx2 = transformHoriz(extractHoriz(c2)),
      sy2 = transformVert(extractVert(c2)),
      x1 = Math.min(sx1,sx2),
      y1 = Math.min(sy1,sy2),
      x2 = Math.max(sx1,sx2),
      y2 = Math.max(sy1,sy2),
      swidth=x2-x1,
      sheight=y2-y1;
  coordinates.push({x1: x1, y1: y1, width: swidth, height: sheight, 
                    color: currentColor, strokeWidth: currentWidth, 
                    type: 'rect'});
  lastsx = sx2;
  lastsy = sy2;
}

function processCoordinatesLine(currentLine, coordinates, g) {
  'use strict';
  var coords = currentLine.split(/[ ,\)<]+/),
      c1, c2, ox1, oy1, ox2, oy2, sx1, sy1, sx2, sy2, coord;
  if (coords.length > 3) {
    c1 = [ parseFloat(coords[0]), parseFloat(coords[1]) ];
    c2 = [ parseFloat(coords[2]), parseFloat(coords[3]) ];
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
  } else if (coords.length === 2) {
    c2 = [ parseFloat(coords[0]), parseFloat(coords[1]) ];
    ox2 = extractHoriz(c2);
    oy2 = extractVert(c2);
    sx2 = transformHoriz(ox2,g);
    sy2 = transformVert(oy2,g);
    try {
      coordinates.push({x1: lastsx, y1: lastsy, x2: sx2, y2: sy2, 
                       ox1: ox1, oy1: oy1, ox2: ox2, oy2: oy2, 
                       color: currentColor, strokeWidth: currentWidth, 
                       type: 'line'});
    } catch(ignore) {} // Pokémon
    lastox = ox2;
    lastoy = oy2;
    lastsx = sx2;
    lastsy = sy2;
  }
  if (coords.length > 4) {
    for (coord in coords) {
      if (coord>3 && isEven(coord) && (coords[coord] !== "")) {
        c2 = [ parseFloat(coords[coord]), parseFloat(coords[parseInt(coord,10)+1]) ];
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

function processCommandLine(currentLine, coordinates, g) {
  'use strict';
  var lineParts = currentLine.split(" "),
      command = lineParts[0],
      args = [],
      part, textValue, textX, textY;
  for (part in lineParts) {
    if (part>0) {
      args.push(lineParts[part]);
    }
  }
  if (command === "color") {
    currentColor = args[0];
  }
  if (command === "width") {
    currentWidth = args[0];
  }
  if (command === "text") {
    textValue = args[0];
    textX = transformHoriz(extractHoriz([args[1],args[2]]),g);
    textY = transformVert(extractVert([args[1],args[2]]),g);
    coordinates.push({x1: textX, y1: textY, 
                      text: textValue, color: currentColor, strokeWidth: currentWidth,
                      type: 'text'});
  }
}

var SDO_POINT_PATT="MDSYS.SDO_GEOMETRY(2001,NULL,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,1,1),MDSYS.SDO_ORDINATE_ARRAY(";
var SDO_LINE_PATT ="MDSYS.SDO_GEOMETRY(2002,NULL,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),MDSYS.SDO_ORDINATE_ARRAY(";
var SDO_RECT_PATT ="MDSYS.SDO_GEOMETRY(2003,NULL,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,1003,3),MDSYS.SDO_ORDINATE_ARRAY(";

function processScriptLine(currentLine, coordinates, gvp) {
  'use strict';
  var line = "",
      geomType="",
      firstChar;
  if (currentLine !== "") {
    geomType = "line";  // default
    if (currentLine.substr(0,92) === SDO_POINT_PATT) {
      line = currentLine.substr(92);
      geomType = "point";
    } else if (currentLine.substr(0,92) === SDO_LINE_PATT) {
      line = currentLine.substr(92);
    } else if (/posList/.test(currentLine)) {
      line = currentLine.match(/posList>.*</)[0].substr(8,currentLine.length);
    } else if (currentLine.substr(0,95) === SDO_RECT_PATT) {
      line = currentLine.substr(95);
      geomType = "rect";
    } else if (currentLine.substr(0,4) === "rect") {
      line = currentLine.substr(5);
      geomType = "rect";
    } else {
      line = currentLine;
    }
    firstChar = line.charAt(0);
    if (isNumber(firstChar)) {
      if (geomType === "line") {
        processCoordinatesLine(line, coordinates, gvp);
      } else if (geomType === "point") {
        processPointLine(line, coordinates, gvp);
      } else {
        processRectangleLine(line, coordinates, gvp);
      }
    } else {
      processCommandLine(line, coordinates, gvp);
    }
  }
}

function processScriptAsXML( xmlstr, geoViewPort ) {
  'use strict';
  var coordinates = [],
      parser, xmlDoc, 
      geometrie, ordinatesNode, ordinates,
      gi, glen,
      oi, olen,
      line, gType;
  if (window.DOMParser) {
    parser=new DOMParser();
    xmlDoc=parser.parseFromString(xmlstr,"text/xml");
  } else { // Internet Explorer
    xmlDoc=new ActiveXObject("Microsoft.XMLDOM");
    xmlDoc.async=false;
    xmlDoc.loadXML(xmlstr); 
  }
  geometrie=xmlDoc.getElementsByTagName('Geometrie');
  //console.log("geometrie: '"+geometrie.length+"'");
  for (gi = 0, glen = geometrie.length; gi<glen; gi++) {
    gType = geometrie[gi].getElementsByTagName('SDO_GTYPE')[0].textContent;
    ordinatesNode=geometrie[gi].getElementsByTagName('SDO_ORDINATES');
    ordinates=ordinatesNode[0].getElementsByTagName('NUMBER');
    if (gType === "2001") { // point
      console.log('point');
    } else if (gType === "2003") {
      line = "";
      for (oi = 0, olen = ordinates.length; oi<olen; oi++) {
        line += ordinates[oi].textContent + " ";
      }
      processCoordinatesLine(line, coordinates, geoViewPort);
    }
  }
  return coordinates;
}

function processScriptToCoordinates() {
  'use strict';
  var myScript = $('#myScript')[0].value,
      scriptLines = myScript.split("\n"),
      coordinates = [],
      gxl = parseFloat($("#y1")[0].value),
      gxr = parseFloat($("#y2")[0].value),
      dx = gxr - gxl,
      gyb = parseFloat($("#x1")[0].value),
      gyt = parseFloat($("#x2")[0].value),
      dy = gyt - gyb,
      currentLine, line,
      firstChar, 
      geoViewPort = {gxr:gxr, gyt:gyt, dx:dx, dy:dy};
  lastsx = 0;
  lastsy = 0;
  currentColor = "red";
  currentWidth = 1;
  firstChar = scriptLines[0].charAt(0);
  if (firstChar === "<") {
    coordinates = processScriptAsXML(myScript,geoViewPort);
  } else {
    for (line in scriptLines) {
      currentLine = scriptLines[line].trim();
      processScriptLine(currentLine,coordinates,geoViewPort);
    }
  }
  return coordinates;
}

function processScript() {
  'use strict';
  var start, coordinates, end, time, messagesSpan;
  start = new Date().getMilliseconds();
  coordinates = processScriptToCoordinates(),
  drawSVGLines( coordinates );
  end = new Date().getMilliseconds();
  time = end - start;
  messagesSpan = $('#messages')[0];
  messagesSpan.innerHTML = "elapsed time (ms): "+time;
}

function drawSVGLines( coordinates ) {
  'use strict';
  var svg = $('#svgbasics').svg('get'),
      lc, lineCoords;
  for (lineCoords in coordinates) {
    lc = coordinates[lineCoords];
    if (lc.type === 'line') {
      svg.line(lc.x1, lc.y1, lc.x2, lc.y2, {stroke: lc.color, 'stroke-width': lc.strokeWidth});
    } else if (lc.type === 'rect') {
      svg.rect(lc.x1, lc.y1, lc.width, lc.height, {fill: 'none',stroke: lc.color, 'stroke-width': lc.strokeWidth});
    } else if (lc.type === 'point') {
      svg.line(lc.x1-15, lc.y1, lc.x1+15, lc.y1, {stroke: lc.color, 'stroke-width': lc.strokeWidth});
      svg.line(lc.x1, lc.y1-15, lc.x1, lc.y1+15, {stroke: lc.color, 'stroke-width': lc.strokeWidth});
    } else {
      svg.text(null, lc.x1, lc.y1, lc.text, {stroke: lc.color, 'stroke-width': lc.strokeWidth});
    }
  }
}
