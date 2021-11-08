// This file defines routes for our application. Its exports will then be imported to "./index.js" to be registered with
// fastify as a middleware plugin to handle requests.
async function routes(fastify, options) {
	// The default route.
	fastify.get('/', async (request, reply) => {
		reply.send({ hello: 'world' })
	})
}

module.exports = routes;