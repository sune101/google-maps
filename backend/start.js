const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

routes(app);

var server = app.listen(8000, () => {
	const port = server.address().port;
	console.log('Server started at http://127.0.0.1:' + port);
});