//imports
//import Papa from 'papaparse';
// Global variables
let map;
// CSV Container
let markers = L.featureGroup();

// initialize
$( document ).ready(function() {
    createMap();
	//readCSV(path)
});

// create the map
function createMap(){
	map = L.map('map').setView([33.80100,-118.205], 13);

	//L.tileLayer('https://api.mapbox.com/styles/v1/edgrmdna/cj0vm58cc00c32rnyk5c7xohw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWRncm1kbmEiLCJhIjoiRV8wRG1URSJ9.-Gjqcw0AmLxIaGP10UuGqg ', 
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',	
		{ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

/*
// function to read csv data
function readCSV(){
		Papa.parse(path, {
		header: true,
		download: true,
		complete: function(data) {
			console.log(data);
			
			// map the data
			mapCSV(data);

		}
	});
}
*/
/*
function mapCSV(data){
	
	// circle options
	let circleOptions = {
		radius: 5,
		weight: 1,
		color: 'grey',
		fillColor: 'red',
		fillOpacity: 1
	}

	// loop through each entry
	data.data.forEach(function(item,index){
		// create marker
		let marker = L.circleMarker([item.latitude,item.longitude],circleOptions)

		// add marker to featuregroup		
		markers.addLayer(marker)
	})

	// add featuregroup to map
	markers.addTo(map)

	// fit markers to map
	map.fitBounds(markers.getBounds())
}
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
        radius: 8,
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
		}
	}).addTo(map);
}
addPlantGeoJson();

// Animal symbols:
var animalMarkerOptions = {
        radius: 8,
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
		}
	}).addTo(map);
}
addAnimalGeoJson();

// Plant symbols:
var fungiMarkerOptions = {
        radius: 8,
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
		}
	}).addTo(map);
}
addFungiGeoJson();