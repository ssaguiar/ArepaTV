
require('dotenv').config();
const lwdb = require("lwdb");
const molly = require('mollyjs');

process.state = new Object();
const PathA = `${__dirname}/View`;
const PathB = `${__dirname}/Controller`;

const server = new molly.createBackend( PathA,PathB )
	.createServer( process.env.PORT );

process.cors = true;
