const { assert, expect } = require('chai');
const { describe, it} = require('mocha');
const initDb = require('../data/database');
const db = initDb('../tests/treasureData.json');
const {
	isInteger,
	isFloat,
	compareByDistance,
	measureTreasureDistance,
	createSendData,
	gridToCoord,
	getSearchableGridArea,
	getNewSquares,
	gridSquaresMapToArray
} = require('../backend/dataProcessing'); 

describe('assertion', function() {
	it('Should assert', function() {
		assert(true);
		expect(true).to.not.equal(false);
	});
});

describe('REST data processing functions', function() {
	it('Should be an integer', function() {
		const answer = isInteger('1234');
		expect(answer).to.equal(true);
	});

	it('Should NOT be a valid integer', function() {
		const answer = isInteger('123.4');
		expect(answer).to.equal(false);
	});

	it('Should be a float', function() {
		const answer = isFloat('123.4');
		expect(answer).to.equal(true);
	});

	it('Should NOT be a valid float', function() {
		const answer = isFloat('abc');
		expect(answer).to.equal(false);
	});

	it('Should sort treasures correctly', function() {
		const treasureA = { distance: 500 };
		const treasureB = { distance: 1500 };
		const treasureC = { distance: 50 };

		expect(compareByDistance(treasureA, treasureB)).to.equal(-1);
		expect(compareByDistance(treasureA, treasureC)).to.equal(1);
	});

	it('Should correclty calculate distance to treasure', function() {
		const treasure = {
			latitude: 1.281,
			longitude: 103.843
		};
		const measureFunction = measureTreasureDistance(1.28, 103.85);

		expect(measureFunction(treasure).distance).to.equal(787);
	});

	it('Should include 3 results', function() {
		const treasures = [
			{ id: '7c7c8839dc27', distance: 50},
			{ id: 'b7b5e2d64d8c', distance: 150 },
			{ id: 'e2220a93e856', distance: 250},
			{ id: '0be59aa01e2a', distance: 350}
		];
		const includeFunction= createSendData(3, db, 5000);

		expect(!!includeFunction(treasures[0])).to.equal(true);
		expect(!!includeFunction(treasures[1])).to.equal(true);
		expect(!!includeFunction(treasures[2])).to.equal(true);
		expect(!!includeFunction(treasures[3])).to.equal(false);
	});

	it('Should convert grid coordinates to longitude and latitude', function() {
		const latLong = gridToCoord(123456, 112223);

		expect(latLong).to.deep.equal({longitude:123.4565, latitude:112.2235});
	});

	it('Should return 280 grid areas', function() {
		const gridAreas = getSearchableGridArea(123456, 112223, 1000);
		const numberOfGridAreas = Object.keys(gridAreas).length;

		expect(numberOfGridAreas).to.equal(280);
	});

	it('Should return an object with all props present in objectA that are not present not objectB', function() {
		const objectA = {a: {}, b: {}, c: {}, d: {}};
		const objectB = {a: {}, b: {}};

		const diff = getNewSquares(objectB, objectA);
		expect(diff).to.deep.equal({c: {}, d: {}});
	});

	it('Should convert grid an object of objects in to an array of objects', function() {
		const data = {a: {x: 0, y: 2}, b: {z: 1, w: 3}};

		const result = gridSquaresMapToArray(data);
		expect(result).to.deep.equal([{x: 0, y: 2}, {z: 1, w: 3}]);
	});
});