// We need "fastify-plugin" here, because we will create an asynchronous decorator, which is the DB client object, and 
// we can access it anywhere as "fastify.db.client".
// See https://www.fastify.io/docs/latest/Decorators/.
const fastifyPlugin = require('fastify-plugin');
// Need "Client" class from "pg" module to access PostgreSQL.
const { Client } = require('pg');

// Create a new Pg client object with values from "/.env" file.
const client = new Client({
	user: process.env.DB_USER,
	password: process.env.DB_PASSWORD,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	database: process.env.DB_NAME
});

// This function try to connect the DB and then attach the client object as a Fastify's decorator (fastify.db.client).
async function dbconnector(fastify, options) {
	try {
		await client.connect();
		fastify.decorate('db', { client });
	} catch (err) {
		console.error(err);
	}
}

// Wrap out function with fastify-plugin to extend the server functionality (with our decorator above) without creating
// new scope when we register it later on ("./index.js").
module.exports = fastifyPlugin(dbconnector);