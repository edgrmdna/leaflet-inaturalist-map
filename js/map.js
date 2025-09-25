// Global variables
let map;
// path to csv data
let path = "data/occurences.csv";
// CSV Container
let markers = L.featureGroup();

// initialize
$( document ).ready(function() {
    createMap();
	readCSV(path)
});

// create the map
function createMap(){
	map = L.map('map').setView([33.80100,-118.205], 13);

	L.tileLayer('https://api.mapbox.com/styles/v1/edgrmdna/cj0vm58cc00c32rnyk5c7xohw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWRncm1kbmEiLCJhIjoiRV8wRG1URSJ9.-Gjqcw0AmLxIaGP10UuGqg ', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
}

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