const geoLib = require('geolib');
const latitude1 = 1.3697273008963178;
const longitude1 = 103.80775451660156;

const latitude2 = 1.369;
const longitude2 = 103.807;

const latitude3 = 1.369;
const longitude3 = 103.808;

console.log(geoLib.computeDestinationPoint({latitude: latitude1, longitude: longitude1}, 10000, 270));

console.log(geoLib.getDistance(
	{latitude: latitude2, longitude: longitude2},
	{latitude: latitude3, longitude: longitude3}
));
