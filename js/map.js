/*
** To Do **
1. Add a pie chart for species based on the scientific or common name?
2. Move the attributes over to the sidebar ✓
3. Add a subset map based on an image to the sidebar
4. Add the layers list to the map to toggle on and off
*/

// Global variables
let map;
let currentHighlightedLayer = null; // Track the currently highlighted marker
let featureCounts = {
    plants: 0,
    animals: 0,
    fungi: 0
};
let layerGroups = {}; // Store layer groups for control

// Initialize
$(document).ready(function() {
    createMap();
    // Initialize sidebar with pie chart and load layers
    initializeLayers();
})

// Create the map
function createMap(){
    map = L.map('map').setView([33.80100,-118.198], 12);

    L.tileLayer('https://api.mapbox.com/styles/v1/edgrmdna/cj0vm58cc00c32rnyk5c7xohw/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiZWRncm1kbmEiLCJhIjoiRV8wRG1URSJ9.-Gjqcw0AmLxIaGP10UuGqg ', 
    //L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',    
        { attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
};

// Function to create pie chart SVG
function createPieChart(data) {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    if (total === 0) return '<p>No data available</p>';
    
    let currentAngle = 0;
    const radius = 80;
    const centerX = 100;
    const centerY = 100;
    
    let paths = '';
    
    data.forEach(item => {
        const percentage = item.count / total;
        const angle = percentage * 2 * Math.PI;
        
        const x1 = centerX + radius * Math.cos(currentAngle - Math.PI / 2);
        const y1 = centerY + radius * Math.sin(currentAngle - Math.PI / 2);
        
        currentAngle += angle;
        
        const x2 = centerX + radius * Math.cos(currentAngle - Math.PI / 2);
        const y2 = centerY + radius * Math.sin(currentAngle - Math.PI / 2);
        
        const largeArc = angle > Math.PI ? 1 : 0;
        
        paths += `<path d="M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z" fill="${item.color}" stroke="#fff" stroke-width="2"/>`;
    });
    
    // Create legend
    let legend = '<div style="margin-top: 10px;">';
    data.forEach(item => {
        const percentage = ((item.count / total) * 100).toFixed(1);
        legend += `
            <div style="display: flex; align-items: center; margin-bottom: 5px;">
                <div style="width: 15px; height: 15px; background-color: ${item.color}; margin-right: 8px; border: 1px solid #999;"></div>
                <span><b>${item.label}:</b> ${item.count} (${percentage}%)</span>
            </div>
        `;
    });
    legend += '</div>';
    
    return `
        <div style="text-align: center;">
            <svg width="200" height="200" viewBox="0 0 200 200">
                ${paths}
            </svg>
            ${legend}
        </div>
    `;
}

// Function to update sidebar with chart
function updateSidebarWithChart() {
    const chartData = [
        { label: 'Plants', count: featureCounts.plants, color: '#57DE79' },
        { label: 'Animals', count: featureCounts.animals, color: '#F77259' },
        { label: 'Fungi', count: featureCounts.fungi, color: '#8C6E41' }
    ];
    
    const chartHTML = createPieChart(chartData);
    
    $('.sidebar').html(`
        <div class="sidebar-content">
            <h3>Species Distribution</h3>
            ${chartHTML}
            <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
            <p style="color: #666; font-style: italic;">Click on a marker to view details</p>
            <div class="sidebar-static-image">
                <img src="path/to/your/image.jpg" alt="Static Image" style="max-width: 100%; height: auto;"/>
            </div>
        </div>
    `);
}

// Click handler function for markers
function onEachFeature(feature, layer) {
    if(feature.properties.eventDate && feature.properties.scientificName && feature.properties.identifier) {
        const scientificName = feature.properties.scientificName;
        const identifiedBy = feature.properties.identifiedBy;
        const verbatimLocality = feature.properties.verbatimLocality;
        const decimalLatitude = feature.properties.decimalLatitude;
        const decimalLongitude = feature.properties.decimalLongitude;
        const identifierPerson = feature.properties.identifier;

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
                fillColor: '#FFFF00',
                color: '#FF0000',
                weight: 3,
                opacity: 1,
                fillOpacity: 1
            });

            // Update the current highlighted layer
            currentHighlightedLayer = layer;

            // Update sidebar content
            const chartData = [
                { label: 'Plants', count: featureCounts.plants, color: '#57DE79' },
                { label: 'Animals', count: featureCounts.animals, color: '#F77259' },
                { label: 'Fungi', count: featureCounts.fungi, color: '#8C6E41' }
            ];
            
            const chartHTML = createPieChart(chartData);
            
            const sidebarContent = `
                <div class="sidebar-content">
                    <h3>Species Distribution</h3>
                    ${chartHTML}
                    <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;">
                    <div class="sidebar-item">
                    _______________________
                        <h3>${scientificName}</h3>
                        <p><b>Identified by:</b> ${identifiedBy}</p>
                        <p><b>Location:</b> ${verbatimLocality}</p>
                        <p><b>Latitude:</b> ${decimalLatitude}</p>
                        <p><b>Longitude:</b> ${decimalLongitude}</p>
                        <img src="${identifierPerson}" style="max-width: 100%; height: auto; margin-top: 10px;"/>
                    </div>
                    <div class="sidebar-static-image">
                        <img src="path/to/your/image.jpg" alt="Static Image" style="max-width: 100%; height: auto;"/>
                    </div>
                </div>
            `;

            // Clear and update sidebar
            $('.sidebar').html(sidebarContent);

            // Prevent event from bubbling to map
            L.DomEvent.stopPropagation(e);
        });
    }
}

// LA River Boundary Buffer Layer
async function addExternalGeoJson() {
    const response = await fetch("data/boundary.geojson");
    const data = await response.json();
    const boundaryLayer = L.geoJSON(data, {
        style: {
            color: '#0066cc',
            weight: 2,
            fillOpacity: 0.1
        }
    }).addTo(map);
    return boundaryLayer;
};

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
    featureCounts.plants = data_plant.features.length;
    var plants = L.geoJSON(data_plant, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, plantMarkerOptions);
        }, 
        onEachFeature: onEachFeature
    });
    return plants;
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
    featureCounts.animals = animal.features.length;
    var animals = L.geoJSON(animal, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, animalMarkerOptions);
        },
        onEachFeature: onEachFeature
    });
    return animals;
};

// Fungi symbols:
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
    featureCounts.fungi = fungi.features.length;
    var fungiLayer = L.geoJSON(fungi, {
        pointToLayer: function (feature, latlng) {
            return L.circleMarker(latlng, fungiMarkerOptions);
        },
        onEachFeature: onEachFeature
    });
    return fungiLayer;
}

// Initialize all layers and add layer control
async function initializeLayers() {
    // Load all layers
    const boundaryLayer = await addExternalGeoJson();
    const plantLayer = await addPlantGeoJson();
    const animalLayer = await addAnimalGeoJson();
    const fungiLayer = await addFungiGeoJson();
    
    // Store layers in global object
    layerGroups = {
        "LA River Boundary": boundaryLayer,
        "Plants": plantLayer,
        "Animals": animalLayer,
        "Fungi": fungiLayer
    };
    
    // Add all layers to map by default
    plantLayer.addTo(map);
    animalLayer.addTo(map);
    fungiLayer.addTo(map);
    
    // Create layer control
    const overlays = {
        "LA River Boundary": boundaryLayer,
        "Plants": plantLayer,
        "Animals": animalLayer,
        "Fungi": fungiLayer
    };
    
    L.control.layers(null, overlays, {
        collapsed: false,
        position: 'topright'
    }).addTo(map);
    
    // Update sidebar after all layers loaded
    updateSidebarWithChart();
}

// Optional: Add click event to map to deselect marker
map.on('click', function() {
    if (currentHighlightedLayer) {
        currentHighlightedLayer.setStyle(currentHighlightedLayer.originalStyle);
        currentHighlightedLayer = null;
    }
    updateSidebarWithChart();
});