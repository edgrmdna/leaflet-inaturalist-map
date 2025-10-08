/*
** To Do **
1. Add a pie chart for species based on the scientific or common name?
2. Move the attributes over to the sidebar
3. Add a subset map based on an image to the sidebar
4. Add the layers list to the map to toggle on and off
*/

// Global variables
let map;
let currentHighlightedLayer = null; // Track the currently highlighted marker

// Initialize
$(document).ready(function() {
    createMap();
})

// Create the map
function createMap(){
	map = L.map('map').setView([33.80100,-118.198], 12);

	//L.tileLayer('https://api.mapbox.com/styles/v1/edgrmdna/cj0vm58cc00c32rnyk5c7xohw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWRncm1kbmEiLCJhIjoiRV8wRG1URSJ9.-Gjqcw0AmLxIaGP10UuGqg ', 
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',	
		{ attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);
};
// Click handler function for markers
function onEachFeature(feature, layer) {
    if(feature.properties.eventDate && feature.properties.scientificName && feature.properties.identifier) {
        const scientificName = feature.properties.verbatimScientificName;
        const identifiedBy = feature.properties.identifiedBy;
        const verbatimLocality = feature.properties.verbatimLocality;
		const dateIdentified = feature.properties.dateIdentified;
        const decimalLatitude = feature.properties.decimalLatitude;
        const decimalLongitude = feature.properties.decimalLongitude;
        const identifierPerson = feature.properties.identifier;
		const occurenceRemarks = feature.properties.occurrenceRemarks;
		var occurenceRemarks2 = String(occurenceRemarks).replace("null", "None");

        // Add click event to update sidebar and highlight marker
        layer.on('click', function(e) {
            // Reset previous highlighted marker
            if (currentHighlightedLayer) {
                currentHighlightedLayer.setStyle(currentHighlightedLayer.originalStyle);
            }

            // Store original style and highlight current marker
            if (!layer.originalStyle) {
                layer.originalStyle = {
                    radius: layer.options.radius,
                    fillColor: layer.options.fillColor,
                    color: layer.options.color,
                    weight: layer.options.weight,
                    opacity: layer.options.opacity,
                    fillOpacity: layer.options.fillOpacity
                };
            }

            // Highlight the clicked marker
            layer.setStyle({
                radius: 8,
                fillColor: '#CFC865',
                color: '#FF0000',
                weight: 3,
                opacity: 0.4,
                fillOpacity: 1
            });

            // Update the current highlighted layer
            currentHighlightedLayer = layer;

            // Update sidebar content
            const sidebarContent = `
                <div class="sidebar-item">
                    <h3>${scientificName}</h3>
                    <br><b>Identified by:</b> ${identifiedBy}
					<br><b>Identification Date: </b>${dateIdentified}
                    <br><b>Location:</b> ${verbatimLocality}
                    <br><b>Latitude:</b> ${decimalLatitude}
                    <br><b>Longitude:</b> ${decimalLongitude}
                    <img src="${identifierPerson}" style="max-width: 100%; height: auto; margin-top: 10px;"/>
					<br><b>Occurence Remarks: </b> ${occurenceRemarks2}
                </div>
            `;

            // Clear and update sidebar
            $('.sidebar').html(sidebarContent);

            // Prevent event from bubbling to map
            L.DomEvent.stopPropagation(e);
        });
    }
}
/*

// pop up function
function onEachFeature(feature, layer) {
	// 
	if(feature.properties.eventDate && feature.properties.scientificName && feature.properties.identifier) {
		scientificName = feature.properties.scientificName;
		identifiedBy = feature.properties.identifiedBy;
		verbatimLocality = feature.properties.verbatimLocality;
		decimalLatitude = feature.properties.decimalLatitude;
		decimalLongitude = feature.properties.decimalLongitude;
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
	
*/

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