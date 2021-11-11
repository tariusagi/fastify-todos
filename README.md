# A simple TODO list API with Fastify and PostgreSQL
*Based on this [tutorial](https://wanjohi.vercel.app/posts/fastify-and-postgresql-rest-api)*.

## Installation
1. Install PostgreSQL and create a database with a table for to-do items (see [PostgreSQL installaton seciton](#postgresql-installation))
2. Install `nodemon` globally with `npm install -g nodemon`.
3. In the project root, run `npm install` to install all dependencies.

## PostgreSQL installation
### Install the PostgreSQL server
On WSL, follow this [guide](https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-database).

During the installation, a special database admin user `postgres` is created, which is also a system user, and the 
authentication method for this user is set to `peer`, which mean the server trust the logged in system local user, thus 
require no more authentication for this user.

But we will need to connect to the server from other places, so we have to switch the authentication method to using
password. First, we have to logged in the server using `psql` client program:
```sh
$sudo -u postgres psql
```
Then, in the `psql` prompt, type in the following SQL statement to set the password for `postgres` database user:
```sql
ALTER USER postgres PASSWORD '123abc';
```
After that, the password for the database user `postgres` was set, type `\q` to exit `psql`.

Now we can configure PostgreSQL server to switch to using password authentication for this user, by edit (as root/sudo) this file 
`/etc/postgresql/12/main/pg_hba.conf`, and change `peer` method in these lines to `md5`.
Before:
```conf
local   all             postgres                                peer
```
After:
```conf
local   all             postgres                                md5
```
After that, restart the PostgreSQL server, such as `sudo service postgresql restart`.

Fromt then on, you can log in to PostgreSQL using password, such as:
```sh
$psql -h localhost -U postgres
```
### Create the todos database and table
Log into PostgreSQL server and create the database `todos`, and then create the `todos` table with:
```sql
CREATE TABLE todos ( 
    id UUID PRIMARY KEY, 
    name VARCHAR(255) NOT NULL, 
    "createdAt" TIMESTAMP NOT NULL, 
    important BOOLEAN NOT NULL, 
    "dueDate" TIMESTAMP, 
    done BOOLEAN NOT NULL 
);
```
You might want to have some items in that table to test the listing API. Do so with:
```sql
INSERT INTO todos (id, name, "createdAt", important, "dueDate",  done) 
VALUES ('54e694ce-6003-46e6-9cfd-b1cf0fe9d332', 'learn fastify', '2021-04-20T12:39:25Z', true, '2021-04-22T15:22:20Z', false); 
INSERT INTO todos (id, name, "createdAt", important, "dueDate",  done)  
VALUES ('d595655e-9691-4d1a-9a6b-9fbba046ae36', 'learn REST APIs', '2021-04-18T07:24:07Z',true, null, false);
```

## Set the server's parameters.
Create an `.env` file at the project root and put in the following lines (modifify the values to your need):
```
API_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123abc
DB_NAME=todos
```

## Test
Run `npm test`. The tests use [Node TAP](https://node-tap.org/) test package and Fastify's 
[light-my-request](https://github.com/fastify/light-my-request) to simulate HTTP request/response to test the app's 
logic without running the server instance.

## Run
Run this app with `npm start`. The server should be listenning to API_PORT above. Then use browser or a REST query 
tool (such as Postman) to test the app.

## API document

### 1. List all to-do items:
Make a GET request at `/` endpoint.

### 2. Adding to-do item
Make a POST request at `/` endpoint with this JSON body:
```json
{
    "name" : "Buy medicine",
    "important" : true,
    "dueDate" : "2021-11-09T11:00:00"
}
```
### 3. Update a to-do item
Make a PATCH request at `/id` endpoint, where `id` is the ID of the item, such as `/54e694ce-6003-46e6-9cfd-b1cf0fe9d332` and this JSON
body:
```json
{
    "important" : false,
    "dueDate" : "2021-11-09T9:00:00Z",
    "done": true
}
```
### 4. Delete a to-do item
Make a DELETE request at `/id` endpoint,  where `id` is the ID of the item, such as `/54e694ce-6003-46e6-9cfd-b1cf0fe9d332`.