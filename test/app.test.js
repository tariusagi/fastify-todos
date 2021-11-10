'use strict';
// Need "tap" module to run our test.
const tap = require('tap');
// Create a new app instance for the test.
const app = require('../src/app')();
// Use this for update and delete API test.
let id;

// List API.
tap.test('query all to-do items', async t => {
	const response = await app.inject({ method: 'GET', url: '/' });
	t.equal(response.statusCode, 200, 'returned a status code of 200');
});

// Add API.
tap.test('add a new to-do item', async t => {
	const response = await app.inject({
		method: 'POST',
		url: '/',
		body: {
			"name": "Buy medicine",
			"important": true,
			"dueDate": "2021-11-09T11:00:00"
		}
	});
	// Store the ID of the newly created item for next tests.
	id = JSON.parse(response.body).addedItem.id;
	t.equal(response.statusCode, 201, 'returned a status code of 201');
});

// Update API.
tap.test('update an existing to-do item', async t => {
	const response = await app.inject({
		method: 'PATCH',
		url: `/${id}`,
		body: {
			"done": true,
			"important": true,
			"dueDate": "2021-11-09T11:00:00"
		}
	});
	t.equal(response.statusCode, 204, 'returned a status code of 204');
});

// Delete API.
tap.test('delete an existing to-do item', async t => {
	const response = await app.inject({
		method: 'DELETE',
		url: `/${id}`
	});
	t.equal(response.statusCode, 204, 'returned a status code of 204');
	// Since the app doesn't close the DB connection after each request, we have to close it here to conclude the test.
	app.db.client.end();
});