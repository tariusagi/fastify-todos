# A simple TODO list API with Fastify and PostgreSQL
*Based on this [tutorial](https://wanjohi.vercel.app/posts/fastify-and-postgresql-rest-api)*.

## Installation
1. Install PostgreSQL. 
2. Install `nodemon` globally with `npm install -g nodemon`.
3. In the project root, run `npm install` to install all dependencies.

## PostgreSQL installation
On WSL, follow this [guide](https://docs.microsoft.com/en-us/windows/wsl/tutorials/wsl-database).

Default configuration of PostgreSQL on Linux/Unix/WSL use logged in system user as a mean of authentication. The default
admin user that PostgreSQL server run as is `postgres`, which also a system user. To logged in the local PostgreSQL with
`pgsql` tool, you must logged in the system as `postgres`, or use `sudo`, such as this command:
```sh
$sudo -u postgres pgsql
```

To make it easier and allow access to PostgreSQL as `postgres` using password, edit (as root/sudo) this file 
`/etc/postgresql/12/main/pg_hba.conf`, and change `peer` method in these lines to `md5`.
Before:
```conf
# Database administrative login by Unix domain socket
local   all             postgres                                peer

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     peer
```
After:
```conf
# Database administrative login by Unix domain socket
local   all             postgres                                md5

# TYPE  DATABASE        USER            ADDRESS                 METHOD

# "local" is for Unix domain socket connections only
local   all             all                                     md5
```
After that, restart the PostgreSQL server, such as `sudo service postgresql restart`.

Fromt then on, you can log in to PostgreSQL using password, such as:
```sh
$pgsql -h localhost -U postgres
```

## Run
Create an `.env` file at the project root and put in the following lines (modifify the values to your need):
```
API_PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=123abc
DB_NAME=todos
```
Run this app with `npm run start`. The server should be listenning to API_PORT above. Then use browser or a REST query 
tool (such as Postman) to test the app.
