'use strict';

// This is the entry point of our application. The first thing to do is importing fastify module as an object.
const fastify = require('fastify');
// Run config() function from "dotenv" module to populate app's environment with values from "/.env" file.
require('dotenv').config();
// Import our DB connector plugin.
const dbConnector = require("./db");
// Import our custom routes module.
const routes = require("./routes");

function build(opts = {}) {
	// Create our app instance from Fastify with logger enabled.
	opts.logger = true;
	const app = fastify(opts);
	// Register our DB connector plugin.
	app.register(dbConnector);
	// Register our routes as fastify's middleware.
	app.register(routes);
	// Return our app instance.
	return app;
}

module.exports = build;