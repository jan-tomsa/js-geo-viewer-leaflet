function changeSrc( newSrc )
{
	document.getElementById("contents").src=newSrc
}

function displayMap()
{
	x1 = document.forms.frm1.x1.value;
	x2 = document.forms.frm1.x2.value;
	y1 = document.forms.frm1.y1.value;
	y2 = document.forms.frm1.y2.value;
	layers = document.forms.frm1.layers.value;
	width = y1-y2
	height = x1-x2
	imgWidth = parseInt(700*width/height)
	//alert("imgWidth:"+imgWidth)
	//src = "http://wms.cuzk.cz/wms.asp?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS="+layers+"&FORMAT=image/png&SRS=EPSG:102067&STYLES=&BBOX=" +y1+ "," + x1 + "," + y2 + "," + x2 + "&WIDTH="+imgWidth+"&HEIGHT=700"
	src = "http://wms.cuzk.cz/wms.asp?SERVICE=WMS&VERSION=1.1.1&REQUEST=GetMap&LAYERS="+layers+"&FORMAT=image/png&SRS=EPSG:102067&STYLES=&BBOX=" +y1+ "," + x1 + "," + y2 + "," + x2 + "&WIDTH=900&HEIGHT=700"
	changeSrc( src );
}

function preset(y1,x1,y2,x2)
{
	document.forms.frm1.x1.value = x1;
	document.forms.frm1.x2.value = x2;
	document.forms.frm1.y1.value = y1;
	document.forms.frm1.y2.value = y2;
}
