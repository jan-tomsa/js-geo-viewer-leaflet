$(function() {
	$('#svgbasics').svg({onLoad: drawInitial});
	$('#rect,#line,#circle,#ellipse').click(drawShape);
	$('#drawLines').click(processScript);
	$('#clear').click(clearLines);
	$('#export').click(function() {
		var xml = $('#svgbasics').svg('get').toSVG();
		$('#svgexport').html(xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
	});
	$("#svgbasics").offset($("#contents").offset())
});

function resetSize(svg, width, height) {
	svg.configure({width: width || $(svg._container).width(),
		height: height || $(svg._container).height()});
}

function clearLines() {
	$('#svgbasics').svg('get').clear();
}

function drawInitial(svg) {
	svg.circle(75, 75, 50, {fill: 'none', stroke: 'red', 'stroke-width': 3});
	var g = svg.group({stroke: 'black', 'stroke-width': 2});
	svg.line(g, 15, 75, 135, 75);
	svg.line(g, 75, 15, 75, 135);
}

var colours = ['purple', 'red', 'orange', 'yellow', 'lime', 'green', 'blue', 'navy', 'black'];

function transformHoriz( x ) {
	gxl = 1 * $("#y1")[0].value;
	gxr = 1 * $("#y2")[0].value;
	dx = gxr - gxl;
	if (Math.abs(x) < 420000) {
		return x;  // no transformation
	} else {
		rawsx = ((x-gxr)/dx*1000)
		return 1000+rawsx;
	}
}

function transformVert( y ) {
	gyb = 1 * $("#x1")[0].value;
	gyt = 1 * $("#x2")[0].value;
	dy = gyt - gyb;
	if (Math.abs(y) < 950000) {
		return y;  // no transformation
	} else {
		rawsy = (y-gyt)/dy*700;
		return -rawsy;
	}
}

function extractHoriz( coo ) {
	cooHoriz = Math.min(Math.abs(coo[0]),Math.abs(coo[1]));
	if (cooHoriz > 500000000) {
		return -cooHoriz/1000;
	} else {
		return -cooHoriz;
	}
}

function extractVert( coo ) {
	cooVert = Math.max(Math.abs(coo[0]),Math.abs(coo[1])); 
	if (cooVert > 900000000) {
		return -cooVert/1000;
	} else {
		return -cooVert;
	}
}

function isEven( n ) { 
	return ((n%2) == 0); 
}

function gatherWorldCoordinatesFromScript( script ) {
	var worldCoordinates = [];
	return worldCoordinates;
}

var sdoLinePatt="MDSYS.SDO_GEOMETRY(2002,NULL,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),MDSYS.SDO_ORDINATE_ARRAY(";
var sdoRectPatt="MDSYS.SDO_GEOMETRY(2003,NULL,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,1003,3),MDSYS.SDO_ORDINATE_ARRAY(";

function isNumber( ch ) {
	return ch.search(/\d/) >= 0;
}

function processCoordinatesLine(currentLine, coordinates) {
	coords = line.split(/[ ,\)]+/);
	if (coords.length > 3) {
		c1 = [ 1*coords[0], 1*coords[1] ];
		c2 = [ 1*coords[2], 1*coords[3] ];
		sx1 = transformHoriz(extractHoriz(c1));
		sy1 = transformVert(extractVert(c1));
		sx2 = transformHoriz(extractHoriz(c2));
		sy2 = transformVert(extractVert(c2));
		coordinates.push({x1: sx1, y1: sy1, x2: sx2, y2: sy2, color: currentColor, width: currentWidth});
		lastsx = sx2;
		lastsy = sy2;
	} else if (coords.length == 2) {
		c2 = [ 1*coords[0], 1*coords[1] ];
		sx2 = transformHoriz(extractHoriz(c2));
		sy2 = transformVert(extractVert(c2));
		coordinates.push({x1: lastsx, y1: lastsy, x2: sx2, y2: sy2, color: currentColor, width: currentWidth});
		lastsx = sx2;
		lastsy = sy2;
	}
	if (coords.length > 4) {
		for (coord in coords) {
			if (coord>3 && isEven(coord) && (coords[coord] != "")) {
				c2 = [ 1*coords[coord], 1*coords[1*coord+1] ];
				sx2 = transformHoriz(extractHoriz(c2));
				sy2 = transformVert(extractVert(c2));
				coordinates.push({x1: lastsx, y1: lastsy, x2: sx2, y2: sy2, color: currentColor, width: currentWidth});
				lastsx = sx2;
				lastsy = sy2;
			}
		}
	}
}

function processCommandLine(currentLine, coordinates) {
	lineParts = currentLine.split(" ");
	command = lineParts[0];
	args = [];
	for (part in lineParts) {
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
		coordinates.push({x1: textX, y1: textY, text: textValue, color: currentColor, width: currentWidth});
	}
}

function processScriptLine(currentLine, coordinates) {
	if (currentLine != "") {
		if (currentLine.substr(0,92) == sdoLinePatt) {
			line = currentLine.substr(92);
		} else {
			line = currentLine;
		}
		firstChar = line.charAt(0);
		if (isNumber(firstChar)) {
			processCoordinatesLine(line, coordinates);
		} else {
			processCommandLine(line, coordinates);
		}
	}
}

function processScript() {
	var myScript = $('#myScript')[0].value;
	var scriptLines = myScript.split("\n");
	var coordinates = [];
	lastx = 0;
	lasty = 0;
	currentColor = "red"
	currentWidth = 1
	for (line in scriptLines) {
		currentLine = scriptLines[line].trim();
		processScriptLine(currentLine,coordinates)
	}
	drawSVGLines( coordinates )
}

function drawSVGLines( coordinates ) {
	var svg = $('#svgbasics').svg('get');
	for (lineCoords in coordinates) {
		lc = coordinates[lineCoords];
		if (lc.text == null) {
			svg.line(lc.x1, lc.y1, lc.x2, lc.y2, {stroke: lc.color, 'stroke-width': lc.width});
		} else {
			svg.text(null, lc.x1, lc.y1, lc.text, {stroke: lc.color, 'stroke-width': lc.width});
		}
	}
}

function drawShape() {
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
	return Math.floor(Math.random() * range);
}

