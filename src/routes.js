// We need this module to generate UID for TODO items.
const { v4: uuidv4 } = require('uuid');
// We need these JSON schemas to validate and serialize our responses.
const { allTodos, addTodo, updateTodo, deleteTodo} = require('./schemas');

async function routes(fastify, options) {
	// Access our DB client instance value from our decorator.
	const client = fastify.db.client;

	// The default route is to list all TODO items.
	// NOTE: we use "allTodos" schema here (see "./schemas.js") to validate and serialize response.
	// Fastify use "fast-json-stringify" module to speed up serialization.
	// See https://www.npmjs.com/package/fast-json-stringify and https://json-schema.org/.
	fastify.get('/', { schema: allTodos }, async function (request, reply) {
		try {
			const { rows } = await client.query('SELECT * FROM todos')
			console.log(rows)
			reply.send(rows)
		} catch (err) {
			throw new Error(err)
		}
	});

	// This POST route is to add new TODO item. It accept a JSON object in the request's body, with "name", "important",
	// "dueDate" as its properties.
	// NOTE: we use "addTodo" schema (see "./schemas.js") to validate and serialize response.
	fastify.post('/', { schema: addTodo }, async function (request, reply) {
		const { name, important, dueDate } = request.body
		const id = uuidv4()
		const done = false
		createdAt = new Date().toISOString()
		const query = {
			text: `INSERT INTO todos (id, name, "createdAt", important, "dueDate", done)
				VALUES($1, $2, $3, $4, $5, $6 ) RETURNING *`,
			values: [id, name, createdAt, important, dueDate, done],
		}
		try {
			const { rows } = await client.query(query)
			console.log(rows[0])
			reply.code(201)
			return { created: true }
		} catch (err) {
			throw new Error(err)
		}
	});

	// This PATCH route update an existing TODO item.
	// NOTE: we use "updateTodo" schema (see "./schemas.js") to validate and serialize response.
	fastify.patch('/:id', { schema: updateTodo }, async function (request, reply) {
		const id = request.params.id;
		const { important, dueDate, done } = request.body;
		const query = {
			text: `UPDATE todos SET 
								important = COALESCE($1, important), 
								"dueDate" = COALESCE($2, "dueDate"), 
								done = COALESCE($3, done) 
								WHERE id = $4 RETURNING *`,
			values: [important, dueDate, done, id]
		}
		try {
			const { rows } = await client.query(query);
			console.log(rows[0]);
			reply.code(204);
		} catch (err) {
			throw new Error(err);
		}
	});

	// This DELETE route delete a TODO item.
	// NOTE: we use "deleteTodo" schema (see "./schemas.js") to validate and serialize response.
	fastify.delete('/:id', { schema: deleteTodo }, async function (request, reply) {
		console.log(request.params);
		try {
			const { rows } = await client.query('DELETE FROM todos WHERE id = $1 RETURNING * ', [request.params.id]);
			console.log(rows[0]);
			reply.code(204);
		} catch (err) {
			throw new Error(err);
		}
	});
}

module.exports = routes;