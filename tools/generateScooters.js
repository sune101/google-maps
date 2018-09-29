const fs = require('fs');
const latitude = 1.3697273008963178;
const longitude = 103.80775451660156;
let treasures = {};
let numberOfTreasures = 0;
const NUMBER_TO_GENERATE = 200000;


const randomId = () => {
	return 'xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
		return v.toString(16);
	});
};

const rnd = (max, min, offset) => {
	let number = Math.random()*(max-min) + min + offset;
	return Math.round(number * 10000) / 10000;
};

while(numberOfTreasures < NUMBER_TO_GENERATE) {
	let lat = rnd(-0.1, 0.08, latitude);
	let long = rnd(-0.2, 0.2, longitude);
	let id = randomId();

	if (!treasures[id]) {
		treasures[id] = {
			latitude: lat,
			longitude: long
		};
		numberOfTreasures++;
		console.log('Created treasure number: ', numberOfTreasures);
	}
}

console.log('Saving treasures');
fs.writeFile('treasures.json', JSON.stringify(treasures), (err) => {
	if (err) {
		return console.log(err);
	}
	console.log('List saved!');
});