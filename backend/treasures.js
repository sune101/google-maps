const geoLib = require('geolib');
const initDb = require('../data/database');
const db = initDb('../data/treasures.json');
const {
	isInteger,
	isFloat,
	compareByDistance,
	measureTreasureDistance,
	createSendData,
	getSearchableGridArea,
	getNewSquares,
	gridSquaresMapToArray
}= require('./dataProcessing');

const getTreasures = (req, res) => {
	// Verify that the in-parameters are correctly formatted
	if (isFloat(req.params.lat) && isFloat(req.params.long) && isInteger(req.params.radius) && isInteger(req.params.number)) {
		const latitude = Number(req.params.lat);
		const longitude = Number(req.params.long);
		const radius = Number(req.params.radius);
		const maxTreasuresToFetch = Number(req.params.number);
		const radiusIncrement = 111; // one square is 111 meters in width and height
		let investigatedGridSquares = {};
		let numberOfFetchedTreasures = 0;
		let currentRadius = radiusIncrement;
		let treasures = [];
		let allFetchedTreasures = [];

		while (numberOfFetchedTreasures <= maxTreasuresToFetch * 2 && currentRadius <= radius + radiusIncrement * 2) {
			const gridSquares = getSearchableGridArea(latitude, longitude, currentRadius);
			const newGridSquares = getNewSquares(investigatedGridSquares, gridSquares);
			const gridSquaresArray = gridSquaresMapToArray(newGridSquares);
			const treasureIds = db.getKeys(gridSquaresArray);
			allFetchedTreasures = allFetchedTreasures.concat(treasureIds);
			numberOfFetchedTreasures += treasureIds.length;
			currentRadius += radiusIncrement;
			investigatedGridSquares = {
				...investigatedGridSquares,
				...newGridSquares
			};
		}

		treasures = db.getByKeys(allFetchedTreasures)
			.map(measureTreasureDistance(latitude, longitude))		// calculate distance to each treasure
			.sort(compareByDistance)								// sort treasures by distance
			.map(createSendData(maxTreasuresToFetch, db, radius))	// Format an array of treasures to send
			.filter(n => n);

		res.status(200).send(treasures);
	} else {
		res.status(400).send({error: 'Malformed parameters'});
	}
};

module.exports = getTreasures;