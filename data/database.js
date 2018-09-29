
const toSearchTree = (treasures) => {
	const geoTree = {};

	Object.keys(treasures).forEach(id => {
		const x = Math.floor(treasures[id].longitude * 1000);
		const y = Math.floor(treasures[id].latitude * 1000);
		
		geoTree[x] = geoTree[x] || {};
		geoTree[x][y] = geoTree[x][y] || [];
		geoTree[x][y].push(id);
	});

	return geoTree;
};

const initDb = (dataSource) => {
	const treasures = require(dataSource);
	const geoTree = toSearchTree(treasures);

	const getKeys = (squares) => {
		let keys = [];

		squares.forEach(square => {
			if(geoTree[square.x]) {
				if (geoTree[square.x][square.y]){
					keys.push(geoTree[square.x][square.y]);
				}
			}
		});
		return [].concat(...keys);
	};
	
	const getByKey = id => ({
		id,
		...treasures[id]
	});

	const getByKeys = keys => keys.map(id => ({
		id,
		...treasures[id]
	}));

	return {
		getKeys,
		getByKey,
		getByKeys
	};
};

module.exports = initDb;
