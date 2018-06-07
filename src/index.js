/*

  ___ ___       ___               _ _       _   ___ ___
 | __/ __|  ___| _ \___ _ _ _ __ (_) |_    /_\ | _ \_ _|
 | _|\__ \ / -_)  _/ -_) '_| '  \| |  _|  / _ \|  _/| |
 |_| |___/ \___|_| \___|_| |_|_|_|_|\__| /_/ \_\_| |___|

*/

//*******************************************************************

'use strict';

//*******************************************************************
// required modules

require('dotenv').config();

const express = require('express');
const helmet = require('helmet');
const cors = require('cors');

const logger = require('./controllers/utility.js').logger;
const loggerParams = { json: true, colorize: true, timestamp: true };
const expressWinston = require('express-winston');
const bodyParser = require('body-parser');
const vcapConstants = require('./controllers/vcap-constants.js');
const moxai = require('moxai');

const routes = require('./routes');

//*******************************************************************
// environment variables

const PORT = process.env.PORT || 8000;

//*******************************************************************
// express

const app = express();

app.use(cors());
app.use(helmet());
app.use(helmet.noCache());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// **********************************************************
// log

expressWinston.requestWhitelist = ['url', 'headers.host', 'method', 'httpVersion', 'originalUrl', 'query', 'referer'];

/** Logging middlelayer */
if (logger.levels[logger.level] >= 2) {
	app.use(expressWinston.logger({
		transports: [
			new logger.transports.Console(loggerParams)
		],
		bodyWhitelist: ['contCn'],
		ignoredRoutes: ['/mocks']
	}));
}

app.use(expressWinston.errorLogger({
	transports: [
		new logger.transports.Console(loggerParams)
	]
}));

//*******************************************************************
// public

app.use(express.static('docs/api'));
app.use('/docs', express.static('docs/api'));
app.use('/docs/api', express.static('docs/api'));
app.use('/docs/code', express.static('docs/code'));

app.use('/api.json', express.static('src/api.json'));
app.use('/docs/api.json', express.static('src/api.json'));
app.use('/schema/api.json', express.static('src/api.json'));

//*******************************************************************
// mocks

if (vcapConstants.SUDS_INFO.USING_MOCKS){
	app.use('/mocks', moxai({'dir': '../mocks', 'file': 'basic', 'random': true}));
}

//*******************************************************************
// routes

app.use('/', routes);

//*******************************************************************
// listen

const server = app.listen(PORT, function () {

	const host = server.address().address;
	const port = server.address().port;

	logger.info('\n  listening at http://%s:%s', host, port);

});

//*******************************************************************
// exports

module.exports = app;

//*******************************************************************
