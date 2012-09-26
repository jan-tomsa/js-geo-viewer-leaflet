$(function() {
	$('#svgbasics').svg({onLoad: drawInitial});
	$('#rect,#line,#circle,#ellipse').click(drawShape);
	$('#drawLines').click(drawLines);
	$('#clear').click(function() {
		$('#svgbasics').svg('get').clear();
	});
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

function drawLines() {
	var myScript = $('#myScript')[0].value;
	var scriptLines = myScript.split("\n");
	var coordinates = [];
	lastx = 0;
	lasty = 0;
        var sdoLinePatt="MDSYS.SDO_GEOMETRY(2002,NULL,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),MDSYS.SDO_ORDINATE_ARRAY(";
	for (line in scriptLines) {
		currentLine = scriptLines[line].trim();
		if (currentLine.substr(0,92) == sdoLinePatt) {
			line = currentLine.substr(92);
		} else {
			alert('Oops!');
			line = currentLine;
		}
		coords = line.split(/[ ,\)]+/);
		if (coords.length > 3) {
			c1 = [ 1*coords[0], 1*coords[1] ];
			c2 = [ 1*coords[2], 1*coords[3] ];
			sx1 = transformHoriz(extractHoriz(c1));
			sy1 = transformVert(extractVert(c1));
			sx2 = transformHoriz(extractHoriz(c2));
			sy2 = transformVert(extractVert(c2));
			coordinates.push([sx1,sy1,sx2,sy2]);
			lastsx = sx2;
			lastsy = sy2;
		} else if (coords.length == 2) {
			c2 = [ 1*coords[0], 1*coords[1] ];
			sx2 = transformHoriz(extractHoriz(c2));
			sy2 = transformVert(extractVert(c2));
			coordinates.push([lastsx,lastsy,sx2,sy2]);
			lastsx = sx2;
			lastsy = sy2;
		}
		if (coords.length > 4) {
			for (coord in coords) {
				if (coord>3 && isEven(coord) && (coords[coord] != "")) {
					c2 = [ 1*coords[coord], 1*coords[1*coord+1] ];
					sx2 = transformHoriz(extractHoriz(c2));
					sy2 = transformVert(extractVert(c2));
					coordinates.push([lastsx,lastsy,sx2,sy2]);
					lastsx = sx2;
					lastsy = sy2;
				}
			}
		}
	}
	drawSVGLines( coordinates )
}

function drawSVGLines( coordinates ) {
	var svg = $('#svgbasics').svg('get');
	for (lineCoords in coordinates) {
		lc = coordinates[lineCoords];
		svg.line(lc[0], lc[1], lc[2], lc [3], {stroke: 'red', 'stroke-width': 1});
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

