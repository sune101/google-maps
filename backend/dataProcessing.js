const geoLib = require('geolib');

const isInteger = input => !isNaN(Number(input)) && Number(input) % 1 === 0;

const isFloat = input => !isNaN(Number(input));

const compareByDistance = (a, b) => {
	if (a.distance < b.distance)
		return -1;
	if (a.distance > b.distance)
		return 1;
	return 0;
};

const measureTreasureDistance = (latitude, longitude) => treasure => ({
	id: treasure.id,
	distance: geoLib.getDistance(
		{latitude: treasure.latitude, longitude: treasure.longitude},
		{latitude: latitude, longitude: longitude}
	)
});

const createSendData = (maxTreasuresToFetch, db, radius) => {
	let numberOfMatchingTreasures = 0;
	return treasure => {
		if(numberOfMatchingTreasures < maxTreasuresToFetch && treasure.distance <= radius) {
			numberOfMatchingTreasures++;
			return {
				...treasure,
				...db.getByKey(treasure.id)
			};
		}
		return null;
	};
};

const gridToCoord = (x, y) => {
	return {
		longitude: (x + 0.5) / 1000,
		latitude: (y + 0.5) / 1000
	};
};

const getSearchableGridArea = (latitude, longitude, radius) => {
	const farTop = geoLib.computeDestinationPoint({latitude, longitude}, radius, 0);
	const farBottom = geoLib.computeDestinationPoint({latitude, longitude}, radius, 180);
	const farRight = geoLib.computeDestinationPoint({latitude, longitude}, radius, 90);
	const farLeft = geoLib.computeDestinationPoint({latitude, longitude}, radius, 270);
	let left = Math.floor(farLeft.longitude * 1000);
	let right = Math.ceil(farRight.longitude * 1000 + 1);
	let top = Math.ceil(farTop.latitude * 1000 + 1);
	let bottom = Math.floor(farBottom.latitude * 1000);
	const coords = {};

	for (let x = left; x <= right; x++) {
		for (let y = bottom; y <= top; y++) {
			if (geoLib.isPointInCircle(gridToCoord(x, y), {latitude, longitude}, radius)) {
				coords[x.toString() + '-' + y.toString()] = {x, y};
			}
			
		}
	}

	return coords;
};

const getNewSquares = (oldSquares, newSquares) => {
	const keys = Object.keys(newSquares);
	const diff = {};

	keys.forEach(key => {
		if (!oldSquares[key]) {
			diff[key] = newSquares[key];
		}
	});
	return diff;
};

const gridSquaresMapToArray = (map) => {
	return Object.keys(map).map(key => map[key]); 
};

module.exports = {
	isInteger,
	isFloat,
	compareByDistance,
	measureTreasureDistance,
	createSendData,
	gridToCoord,
	getSearchableGridArea,
	getNewSquares,
	gridSquaresMapToArray
};