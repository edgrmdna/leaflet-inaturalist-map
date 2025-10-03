// Global variables
let map;
// CSV Container
//let markers = L.featureGroup();
let plantMarkers = L.featureGroup();
// initialize
$( document ).ready(function() {
    createMap();
})

// create the map
function createMap(){
	map = L.map('map').setView([33.80100,-118.198], 12);

	L.tileLayer('https://api.mapbox.com/styles/v1/edgrmdna/cj0vm58cc00c32rnyk5c7xohw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWRncm1kbmEiLCJhIjoiRV8wRG1URSJ9.-Gjqcw0AmLxIaGP10UuGqg ', 
	//L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',	
		{ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
};
/*
// On Each feature alternative
    function onEachFeature(feature, layer) {
        if(feature.properties.eventDate && feature.properties.scientificName && feature.properties.identifier) {
			scientificName = feature.properties.scientificName;
			identifiedBy = feature.properties.identifiedBy;
			verbatimLocality = feature.properties.verbatimLocality;
			decimalLatitude = feature.properties.decimalLatitude;
			decimalLongitude = feature.properties.decimalLongitudel;
			identifierPerson = feature.properties.identifier;

			description = "Identified by: " + identifiedBy + "\n" + 
			"\nLocation: " + verbatimLocality + "\n" + 
			"\nLatitude: " + decimalLatitude + "\n" +
			"\nLongitude: " + decimalLongitude + "\n" +
			"<img src='" + identifierPerson +"' height='275px' width='275px'/>"

            const sidebarContent = '<h2>${scientificName}</h2><p>${description}</p>';
            // Instead of binding a popup, set up a click listener
            layer.on('click', function() {
				//$('.sidebar').empty();
				//document.getElementsByClassName('sidebar-item').innerHTML = sidebarContent;
				$('.sidebar').append('<div class="sidebar-item">'+description+'</div>');

			});
        }
    }
		*/

// pop up function
function onEachFeature(feature, layer) {
	// 
	if(feature.properties.eventDate && feature.properties.scientificName && feature.properties.identifier) {
		scientificName = feature.properties.scientificName;
		identifiedBy = feature.properties.identifiedBy;
		verbatimLocality = feature.properties.verbatimLocality;
		decimalLatitude = feature.properties.decimalLatitude;
		decimalLongitude = feature.properties.decimalLongitudel;
		identifierPerson = feature.properties.identifier;

		layer.bindPopup("<b>Scientific Name: </b>" + scientificName+ "\n"+ 
			"<br><b>Identified by: </b>" + identifiedBy + 
			"<br><b>Location: </b>" + verbatimLocality + 
			"<br><b>Latitude: </b>" + decimalLatitude +
			"<br><b>Longitude: </b>" + decimalLongitude +
			"<img src='" + identifierPerson +"' height='300px' width='300px'/>"
		);
	}
	//$('.sidebar').append('<div class="sidebar-item">'+scientificName+'</div>');
}
	

// LA River Boundary Buffer Layer
async function addExternalGeoJson() {
    const response = await fetch("data/boundary.geojson");
    const data = await response.json();
    L.geoJSON(data).addTo(map);
};
addExternalGeoJson();

// Plant symbols:
var plantMarkerOptions = {
        radius: 4,
        fillColor: "#57DE79",
        color: "#000",
        weight: 1,
        opacity: 0.45,
        fillOpacity: 0.8
    };

// Add Plant Geojson
async function addPlantGeoJson(){
	const response = await fetch("data/Plantae_Kingdom.geojson");
	const data_plant = await response.json();
	var plants = L.geoJSON(data_plant, {
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, plantMarkerOptions);
		}, 
		onEachFeature: onEachFeature
	}).addTo(map);
};

// Animal symbols:
var animalMarkerOptions = {
        radius: 4,
        fillColor: "#F77259",
        color: "#000",
        weight: 1,
        opacity: 0.45,
        fillOpacity: 0.8
    };

// Add Animal Geojson
async function addAnimalGeoJson(){
	const response = await fetch("data/Animalia_Kingdom.geojson");
	const animal = await response.json();
	L.geoJSON(animal, {
		pointToLayer:  function (feature, latlng) {
			return L.circleMarker(latlng, animalMarkerOptions);
		},
		onEachFeature: onEachFeature
	}).addTo(map);
};
//addAnimalGeoJson();

// Plant symbols:
var fungiMarkerOptions = {
        radius: 4,
        fillColor: "#8C6E41",
        color: "#000",
        weight: 1,
        opacity: 0.45,
        fillOpacity: 0.8
    };

// Add Fungi Geojson
async function addFungiGeoJson(){
	const response = await fetch("data/Fungi_Kingdom.geojson");
	const fungi = await response.json();
	overlay = L.geoJSON(fungi, {
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, fungiMarkerOptions);
		},
		onEachFeature: onEachFeature
	}).addTo(map);
}

// Add geojsons to dictionary
//var animalGeojson = addAnimalGeoJson();
var plantGeojson = addPlantGeoJson();
var fungiGeojson = addFungiGeoJson();

var layersByKingdom = {
	"Animals" : animalGeojson,
	"Plants" : plantGeojson,
	"Fungi" : fungiGeojson
};

// Layer Control
//var control = L.control.layers(plantGeojson).addTo(map);
