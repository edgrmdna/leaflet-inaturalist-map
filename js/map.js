var map = L.map('map').setView([33.80100,-118.205], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png ', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

var marker = L.marker([33.8010067,-118.20565]).addTo(map)
		.bindPopup('Los Angeles River')
		.openPopup();	
