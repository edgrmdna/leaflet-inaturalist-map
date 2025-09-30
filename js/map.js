// Global variables
let map;
// CSV Container
let markers = L.featureGroup();

// initialize
$( document ).ready(function() {
    createMap();
});

$('.sidebar').append('<div class="sidebar-item">'+"Animalia"+'</div>')
$('.sidebar').append('<div class="sidebar-item">'+"Plantae"+'</div>')
$('.sidebar').append('<div class="sidebar-item">'+"Fungi"+'</div>');

// create the map
function createMap(){
	map = L.map('map').setView([33.80100,-118.198], 12);

	//L.tileLayer('https://api.mapbox.com/styles/v1/edgrmdna/cj0vm58cc00c32rnyk5c7xohw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWRncm1kbmEiLCJhIjoiRV8wRG1URSJ9.-Gjqcw0AmLxIaGP10UuGqg ', 
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',	
		{ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
};

// pop up function
function onEachFeature(feature, layer) {
	// 
	if(feature.properties.eventDate && feature.properties.scientificName && feature.properties.identifier) {
		layer.bindPopup("Scientific Name: " + feature.properties.scientificName+ "\n"+ 
			"\nIdentified by: " + feature.properties.identifiedBy + "\n" + 
			"\nLocation: " + feature.properties.verbatimLocality + "\n" + 
			"\nLatitude: " + feature.properties.decimalLatitude + "\n" +
			"\nLongitude: " + feature.properties.decimalLongitude + "\n" +
			"<img src='" + feature.properties.identifier +"' height='300px' width='300px'/>"
		);
		//feature.unbindPopup();
		//uncomment the above line and pipe all of the content into the sidebar
	}
}

// Heatmap
// Saving for later
/*
$.get('./data/occurences.csv', function(csvString) {

      // Use PapaParse to transform file into arrays
      var data = Papa.parse(csvString.trim()).data.filter(
        function(row) { return row.length === 2 }
      ).map(function(a) {
        return [ parseFloat(a[0]), parseFloat(a[1]) ]
      })

      // Add all points into a heat layer
      var heat = L.heatLayer(data, {
        radius: 25
      })

      // Add the heatlayer to the map
      heat.addTo(map)
    })
*/

async function addExternalGeoJson() {
    const response = await fetch("data/boundary.geojson");
    const data = await response.json();
    L.geoJSON(data).addTo(map);
	L.geoJSON()

}
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

async function addPlantGeoJson(){
	const response = await fetch("data/Plantae_Kingdom.geojson");
	const data_plant = await response.json();
	L.geoJSON(data_plant, {
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, plantMarkerOptions);
		}, 
		onEachFeature: onEachFeature
	}).addTo(map);
}
addPlantGeoJson();

// Animal symbols:
var animalMarkerOptions = {
        radius: 4,
        fillColor: "#F77259",
        color: "#000",
        weight: 1,
        opacity: 0.45,
        fillOpacity: 0.8
    };

async function addAnimalGeoJson(){
	const response = await fetch("data/Animalia_Kingdom.geojson");
	const data_plant = await response.json();
	L.geoJSON(data_plant, {
		pointToLayer:  function (feature, latlng) {
			return L.circleMarker(latlng, animalMarkerOptions);
		},
		onEachFeature: onEachFeature
	}).addTo(map);
}
addAnimalGeoJson();

// Plant symbols:
var fungiMarkerOptions = {
        radius: 4,
        fillColor: "#8C6E41",
        color: "#000",
        weight: 1,
        opacity: 0.45,
        fillOpacity: 0.8
    };
async function addFungiGeoJson(){
	const response = await fetch("data/Fungi_Kingdom.geojson");
	const data_plant = await response.json();
	L.geoJSON(data_plant, {
		pointToLayer: function (feature, latlng) {
			return L.circleMarker(latlng, fungiMarkerOptions);
		},
		onEachFeature: onEachFeature
	}).addTo(map);
}
addFungiGeoJson();