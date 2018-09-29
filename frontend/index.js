let centerIcon = 'center.png';
const domMap = document.getElementById('map');
const domLatitude = document.getElementById('lat');
const domLongitude = document.getElementById('long');
const domRadius = document.getElementById('radius');
const domMaxFetch = document.getElementById('number');
const domTreasureSelector = document.getElementById('treasures');
const startLatitude = 1.330501;
const startLongitude = 103.88861;
let center = new google.maps.LatLng(startLatitude, startLongitude);
let treasureMarkers = [];
let timeoutId = 0;
let fetchedTreasures = [];
const event = new Event('change');
const map = new google.maps.Map(domMap, {
	center: center,
	zoom: 17
});

let centerMarker = new google.maps.Marker({
	position: center,
	map: map,
	animation: google.maps.Animation.DROP,
	icon: centerIcon,
	title: 'You are here!'
});

const init = () => {
	domLatitude.value = startLatitude;
	domLongitude.value = startLongitude;
	domRadius.value = 1000;
	domMaxFetch.value = 200;
	ajaxLoader(domLatitude.value, domLongitude.value, domRadius.value, domMaxFetch.value, processData);
};

const ajaxLoader = (lat, long, radius, max, callback) => {
	let httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = () => {
		if (httpRequest.readyState === 4) {
			if (httpRequest.status === 200) {
				var data = JSON.parse(httpRequest.responseText);
				if (callback) {
					callback(data);
				}
			}
		}
	};
	const path = `/treasures/${lat}/${long}/${radius}/${max}`;
	httpRequest.open('GET', path);
	httpRequest.send(); 
};

const drawMarkers = (treasures, markedId) => {
	let selected = markedId || domTreasureSelector.value;
	treasureMarkers.forEach(marker => {
		marker.setMap(null);
	});
	treasureMarkers = [];

	treasures.forEach(treasure => {
		treasureMarkers.push(new google.maps.Marker({
			position: new google.maps.LatLng(treasure.latitude, treasure.longitude),
			map: map,
			animation: selected === treasure.id ? google.maps.Animation.BOUNCE : null,
			title: `Treasure ${treasure.id} Latitude ${treasure.latitude} Longitude ${treasure.longitude}`
		}));
	});
};

const updateDropDown = (treasures) => {
	let options = '';
	treasures.forEach(treasure => options += `<option value="${treasure.id}">Treasure ${treasure.id} Latitude ${treasure.latitude} Longitude ${treasure.longitude}</option>`);
	domTreasureSelector.innerHTML = options;
};

const processData = (treasures) => {
	fetchedTreasures = treasures;
	updateDropDown(treasures);
	drawMarkers(treasures);
};

google.maps.event.addListener(map, 'center_changed', () => {
	center = map.getCenter();
	centerMarker.setPosition(center);
	domLatitude.value = center.lat();
	domLongitude.value = center.lng();
	domLatitude.dispatchEvent(event);
});

[domLatitude, domLongitude].forEach(field => field.addEventListener('blur', () => {
	center = new google.maps.LatLng(domLatitude.value, domLongitude.value);
	map.setCenter(center);
}));

[domLatitude, domLongitude, domRadius, domMaxFetch].forEach(field => field.addEventListener('change', () => {
	clearTimeout(timeoutId);
	timeoutId = setTimeout(() => {
		ajaxLoader(domLatitude.value, domLongitude.value, domRadius.value, domMaxFetch.value, processData);
	}, 10);
}));

domTreasureSelector.addEventListener('change', () => {
	drawMarkers(fetchedTreasures, domTreasureSelector.value);
});

init();