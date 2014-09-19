//Array to hold markers
var markers = [];
var CurrentLocationMarker = [];
var CurrentMarker;

//App Object
var PFIAPP = {};
PFIAPP.selectionQueue = {
	"processing" : false,
	"stack" : []
};

//Google Map API Load
function initialize() {

	var myStyles = [ {
		featureType : "poi",
		elementType : "labels",
		stylers : [ {
			visibility : "off"
		} ]
	} ];

	var mapOptions = {
		zoom : 6,
		center : new google.maps.LatLng(-38.5546, 144.635),
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		styles : myStyles
	};

	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

	//Define OSM map type pointing at the OpenStreetMap tile server
	var imageMapType = new google.maps.ImageMapType({
		getTileUrl : function(coord, zoom) {
			return "Tiles/" + zoom + "/" + coord.x + "/" + coord.y + ".png";
		},
		tileSize : new google.maps.Size(256, 256),
		maxZoom : 19
	});

	map.overlayMapTypes.push(imageMapType);

	var southWest = new google.maps.LatLng(-37.898156, 144.895935);
	var northEast = new google.maps.LatLng(-37.837547, 145.115511);

	var bounds = new google.maps.LatLngBounds(southWest, northEast);
	map.fitBounds(bounds);

	var PFINode = {
		url : 'Content/themes/pfi/img/PFIMarker.png',
		anchor : new google.maps.Point(4, 4),
		zIndex : 1
	};

	//Autocomplete Code

	var input = document.getElementById('search');

	var options = {
		bounds : bounds,
		componentRestrictions : {
			country : 'au'
		}
	};
	var autocomplete = new google.maps.places.Autocomplete(input, options);

	google.maps.event.addListener(autocomplete, 'place_changed', function() {

		var place = autocomplete.getPlace();

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);
		}

	});

	//Adds a listener to for when the map stops moving and runs function showMarker
	google.maps.event.addListener(map, 'idle', showMarkers);

	//Disable AJAX Cache
	$.ajaxSetup({
		cache : false
	});

	//Start showMarkers Function
	function showMarkers() {
		var bounds = map.getBounds();

		// Add a marker to the map and push to the array.
		function addMarker(location, nodetitle) {

			var marker = new google.maps.Marker({
				position : location,
				map : map,
				icon : PFINode,
				title : nodetitle
			});
			markers.push(marker);

			google.maps.event.addListener(marker, 'click', function() {
				moveCurrentLocation(location);
				CurrentMarker = nodetitle;
				LetterGen(nodetitle);
			});

		}

		function setAllMap(map) {
			for (var i = 0; i < markers.length; i++) {
				markers[i].setMap(map);
			}
		}

		// Removes the overlays from the map, but keeps them in the array.
		function clearOverlays() {
			setAllMap(null);
		}

		// Shows any overlays currently in the array.
		function showOverlays() {
			setAllMap(map);
		}

		// Deletes all markers in the array by removing references to them.
		function deleteOverlays() {
			clearOverlays();
			markers = [];
		}

		function checkMarkerExist(id, arrayLoopObj, dataSource) {
			for (var m = 0; m < arrayLoopObj.length; m++) 
			{
				if (arrayLoopObj[m][dataSource] == id)
				{
					return true;
				}
			}
			return false;
		}

		function removeMarker(id) 
		{
			for (var n = 0; n < markers.length; n++) 
			{
				if (markers[n].title == id) 
				{
					markers[n].setMap(null);
					markers.splice(n, 1);
					return true;
				}
			}
			return false;
		}

		if (map.getZoom() > 16) //Was 16
		{
			//deleteOverlays();

			lng1 = bounds.getSouthWest().lng();
			lat1 = bounds.getSouthWest().lat();
			lng2 = bounds.getNorthEast().lng();
			lat2 = bounds.getNorthEast().lat();

			var limit = 1000;
			var jsonaddress = "PFI/JSONLocations?x1=" + lng1 + "&x2=" + lng2
					+ "&y1=" + lat1 + "&y2=" + lat2 + "&limit=" + limit;

			//Grab JSON file
			$.getJSON(jsonaddress,
					function(data) {

						//Loop through and add any new markers
						for (var i = 0; i < data.length; i++) {

							var lng = data[i].Longitude;
							var lat = data[i].Latitude;
							var pointloc = new google.maps.LatLng(lat, lng);
							var nodetitle = data[i].NodeId.toString();

							if (markers.length == 0) {
								addMarker(pointloc, nodetitle);
							}

							if (checkMarkerExist(data[i].NodeId.toString(),
									markers, 'title') === false) {
								addMarker(pointloc, nodetitle);
							}

						}

						//Loop through and remove any old markers
						for (var i = markers.length - 1; i >= 0; i--) {

							if (checkMarkerExist(markers[i].title, data,
									'NodeId') === false) {
								removeMarker(markers[i].title);
							}

						}

					});
		} else {
			deleteOverlays();
		}
	};
	//End Show Markers
};

google.maps.event.addDomListener(window, 'load', initialize);

//Change current location marker
function moveCurrentLocation(position) {

	var PFILocationNode = {
		url : 'Content/themes/pfi/img/PFILocationmarker.png',
		anchor : new google.maps.Point(14, 39),
		zIndex : 2
	};

	//Lets Delete the old marker
	for (var i = 0; i < CurrentLocationMarker.length; i++) {
		CurrentLocationMarker[i].setMap(null);
	}
	CurrentLocationMarker = [];

	var Current = new google.maps.Marker({
		position : position,
		icon : PFILocationNode,
		map : map,
	});
	CurrentLocationMarker.push(Current);

};

//Get Letter View from MVC and then fill Div
function drawletter2(id) {

	//After unblock then we can check array queue is empty
	//Empty, swap the boolean and job done
	//Take the last entered value and clear array, run through LetterGen again
	$('div#main')
			.block(
					{
						message : '<h1><img src="Content/themes/pfi/img/loading.gif" /> Just a moment...</h1>',
						centerY : false,
						css : {
							top : '200px',
							left : '20px'
						},
						baseZ : 900
					});

	$('#tutorial-container').hide();
	$('#graph-container').show();
	$('#navNode').show();
	$('#navPdf').show();

	$('div#letter-container').load('PFI/Letter/' + id, function() {
		//The Jquery Delay function doesnt work so well in IE, so I'm using setTimeout instead
		//One second delay so the ajaq blocking window is smooth even with a fast connection
		window.setTimeout(function() {

			if (PFIAPP.selectionQueue.stack.length > 0) {
				var nextID = PFIAPP.selectionQueue.stack.pop();
				PFIAPP.selectionQueue.stack.length = 0;
				PFIAPP.selectionQueue.processing = false;
				$('div#main').unblock();
				LetterGen(nextID);

			} else {
				PFIAPP.selectionQueue.processing = false;
				$('div#main').unblock();
			}

		}, 2200);
	});
};

//Function to Redraw HighCharts
function drawGraph2(id) {

	//Finds HighChart Object
	var chart = $('#graph-container').highcharts();

	//Deletes old series
	while (chart.series.length > 0) {
		chart.series[0].remove();
	}

	var jsonaddress = 'PFI/JSONNode/' + id;

	var seriesdata = Array();

	//Grab Node Data from JSON file
	$.getJSON(jsonaddress, function(data) {

		seriesdata.push(Array(0, data[0].Minimum));

		var PF = data[0].PressureFlows;

		for (var i = 0; i < data[0].PressureFlows.length; i++) {
			seriesdata.push(Array(PF[i].Flow, PF[i].Pressure));
		}

		//Add new series
		var series = chart.addSeries({
			name : 'Node: ' + data[0].HydrantName,
			data : seriesdata,
			marker : {
				symbol : 'circle'
			}
		});
	});
};

//Create HighCharts

$(window).ready(
		function() {

			$(function() {
				$('#graph-container').highcharts(
						{
							chart : {
								marginRight : 25
							},
							title : {
								text : 'Pressure and Flow Curve',
							},
							xAxis : {
								title : {
									text : 'Flow (L/s)'
								},
								tickInterval : 5
							},
							yAxis : {
								title : {
									text : 'Pressure (m)'
								},
								plotLines : [ {
									value : 0,
									width : 1,
									color : '#808080'
								} ]
							},
							colors : [ '#3399CC' ],
							tooltip : {
								formatter : function() {
									return '<b>Flow: </b>' + this.x
											+ ' L/s<br/>' + '<b>Pressure: </b>'
											+ this.y + 'm<br/>'
								}
							}
						});
			});

			//If you hide this too quickly it wont go 100% width
			setTimeout(function() {
				$('#graph-container').hide();
			}, 300);
		});

function LetterGen(id) {

	//Check boolean, are we waiting to refresh?
	if (PFIAPP.selectionQueue.processing) {
		//Yes, well lets add it to the array queue
		PFIAPP.selectionQueue.stack.push(id);
	} else {
		//No, ok well flip switch and then start the ajax process
		PFIAPP.selectionQueue.processing = true;

		//Lets draw this node
		drawGraph2(id);
		drawletter2(id);
		$("a#pdf-button").attr('href', 'PFI/PDF/' + id);
		$("span#node-label").text(" Node: " + id);
	}
};

$(function() {

	$("#dialog-confirm").dialog(
			{
				resizable : false,
				autoOpen : true,
				width : 450,
				height : 470,
				modal : true,
				create : function() {
					$(this).closest('div.ui-dialog').find(
							'button.ui-dialog-titlebar-close').click(
							function(e) {
								window.location.href = "Account/Logoff/";
								e.preventDefault();
							})
				},
				buttons : {
					"Confirm" : function() {
						$(this).dialog("close");
					},
					Cancel : function() {
						//$(this).dialog("close");
						window.location.href = "Account/Logoff/";
					}
				}
			});

});