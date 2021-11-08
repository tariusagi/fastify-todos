// This is the entry point of our application. The first thing to do is importing fastify module as an object.
const fastify = require('fastify')({ logger: true });
// Import our custom routes module.
const routes = require("./routes");

// Set listenning port to 3000 or use PORT environmental variable.
const PORT = process.env.PORT || 3000;

// Register our routes module as fastify's middleware.
fastify.register(routes);

// The entry function of our application.
async function start() {
	try {
		// Tell fastify to start a server at the given port.
		await fastify.listen(3000)
	} catch (err) {
		// In case of error during server runtime, log the error and exit the app.
		fastify.log.error(err)
		process.exit(1)
	}
}

// Now run the application.
start();