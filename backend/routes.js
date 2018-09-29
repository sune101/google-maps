const serveStatic = require('serve-static');
const getTreasures = require('./treasures');

const router = (app) => {
	//File Server
	app.use('/', serveStatic(__dirname + '/../frontend', {'index': ['index.html']}));

	// Rest interface for fetching treasures by position and radius
	app.get('/treasures/:lat/:long/:radius/:number', getTreasures);
};
  
module.exports = router;