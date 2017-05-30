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

const path = require('path');
const fsr = require('file-stream-rotator');
const mkdirp = require('mkdirp');
const morgan = require('morgan');
const bodyParser = require('body-parser');
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

const logDirectory = path.join(__dirname, '../log');
    
mkdirp(logDirectory);

const accessLogStream = fsr.getStream({
	filename: logDirectory + '/fs-epermit-api-%DATE%.log',
	frequency: 'daily',
	verbose: false
});

app.use(morgan('combined', {stream: accessLogStream}));

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

app.use('/mocks', moxai({'dir': '../mocks', 'file': 'basic', 'random': true}));

//*******************************************************************
// routes

app.use('/', routes);

//*******************************************************************
// listen

const server = app.listen(PORT, function () {

	const host = server.address().address;
	const port = server.address().port;

	console.log('\n  listening at http://%s:%s', host, port);

});

//*******************************************************************
// exports

module.exports = app;

//*******************************************************************
