/*global drawInitial */
/*global GeoViewer */
$(function() {
    'use strict';
    $('#svgbasics').svg({onLoad: drawInitial});
    $('#drawLines').click(processScript);
    $('#mbr').click(GeoViewer.mbr);
    $('#clear').click(clearLines);
    $('#export').click(function() {
      var xml = $('#svgbasics').svg('get').toSVG();
      $('#svgexport').html(xml.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'));
    });
    $("#svgbasics").offset($("#contents").offset());

    $("#switchGvOsm").click(GeoViewer.switchToOpenStreetMap);
    var $switchGvWms = $("#switchGvWms");
    $switchGvWms.click(GeoViewer.switchToWms);
    $switchGvWms.attr("disabled",true);
    $("#gvZoomIn").click(GeoViewer.zoomIn);
    $("#gvZoomOut").click(GeoViewer.zoomOut);
    $("#gvPanWest").click(GeoViewer.panWest);
    $("#gvPanEast").click(GeoViewer.panEast);
    $("#gvPanNorth").click(GeoViewer.panNorth);
    $("#gvPanSouth").click(GeoViewer.panSouth);
});
