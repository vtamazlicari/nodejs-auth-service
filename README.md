# node-server

A small REST API for user registration, login and user management, built with Express, Sequelize and MySQL. Authentication uses JSON Web Tokens.

## Stack

- Node.js, Express
- MySQL 5.7, Sequelize (with `sequelize-cli` migrations)
- `jsonwebtoken` for auth, `winston` for logging
- Mocha and Chai for tests

## Getting started

### With Docker

```bash
docker-compose up
```

This starts two containers:

| Service | Container   | Port                                  |
|---------|-------------|---------------------------------------|
| `db`    | `lab5_db`   | `3306` (MySQL, root password `parola`) |
| `node`  | `lab5_node` | host `80` → container `8080`          |

The MySQL image does not create the `db` database, so create it and run the migrations once the database is up (see [Database](#database)).

### Locally

Requires Node.js and a MySQL server on `localhost:3306` with user `root` / password `parola`.

```bash
npm install
npm start
```

The server listens on `0.0.0.0:80` by default. Set `PORT` to change it (ports below 1024 may need elevated privileges):

```bash
PORT=8080 npm start
```

## Configuration

Settings live in [config/default.js](config/default.js) and can be overridden with environment variables:

| Variable       | Default                      | Purpose              |
|----------------|------------------------------|----------------------|
| `PORT`         | `80`                         | HTTP port            |
| `HOST`         | `0.0.0.0`                    | Bind address         |
| `MYSQL_URI`    | `mysql://localhost:3306/db`  | Database URI         |
| `DEBUG_LOGGER` | `false`                      | Verbose logging      |

[config/config.json](config/config.json) holds the database settings that `sequelize-cli` uses for migrations.

## Database

Create the database, then run the migrations:

```bash
mysql -h 127.0.0.1 -u root -pparola -e "CREATE DATABASE IF NOT EXISTS db;"
npx sequelize db:migrate
```

This creates the `user` table (`id`, `first_name`, `last_name`, `email`, `password`).

## API

All bodies are JSON. Every route except login and register needs the token from login or register in the `Authorization` header, with no `Bearer` prefix:

```
Authorization: <token>
```

Tokens expire after 10 days.

| Method   | Path                 | Auth | Description          |
|----------|----------------------|------|----------------------|
| `POST`   | `/api/v1/register`   | no   | Create an account    |
| `POST`   | `/api/v1/login`      | no   | Log in               |
| `GET`    | `/api/v1/users`      | yes  | List all users       |
| `POST`   | `/api/v1/users`      | yes  | Create a user        |
| `DELETE` | `/api/v1/users/:id`  | yes  | Delete a user        |

### Register

```bash
curl -X POST http://localhost/api/v1/register \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Ana","lastName":"Pop","email":"ana@example.com","password":"secret"}'
```

```json
{ "userData": { "id": 1, "firstName": "Ana", "lastName": "Pop", "email": "ana@example.com" }, "token": "<jwt>" }
```

### Login

```bash
curl -X POST http://localhost/api/v1/login \
  -H "Content-Type: application/json" \
  -d '{"email":"ana@example.com","password":"secret"}'
```

```json
{ "token": "<jwt>", "userData": { "id": 1, "firstName": "Ana", "lastName": "Pop", "email": "ana@example.com" } }
```

### List users

```bash
curl http://localhost/api/v1/users -H "Authorization: <jwt>"
```

```json
{ "responsData": [ { "id": 1, "firstName": "Ana", "lastName": "Pop", "email": "ana@example.com" } ] }
```

### Create user

Same body as register. Returns `{ "userData": { ... } }`.

### Delete user

```bash
curl -X DELETE http://localhost/api/v1/users/1 -H "Authorization: <jwt>"
```

```json
{ "responsData": "Delete successful!" }
```

### Errors

Errors return the matching HTTP status with an error code string as the body, for example:

| Status | Body                       | When                                  |
|--------|----------------------------|---------------------------------------|
| 400    | `"INVALID_EMAIL_ADDRESS"`  | Email is missing or malformed         |
| 403    | `"TOKEN_NOT_RECEIVED"`     | No `Authorization` header             |
| 403    | `"UNKNOWN_AUTHORIZATION_ERROR"` | Token is invalid or expired      |
| 404    | `"USER_NOT_EXIST"`         | Login with an unknown email           |
| 404    | `"PASSWORD_COMPARE_FAILED"`| Login with a wrong password           |
| 404    | `"ID_NOT_FOUND"`           | Deleting a user that does not exist   |
| 409    | `"USER_ALREADY_EXISTS"`    | Registering an email already in use   |

## Tests

```bash
npm test
```

Tests are in [test/](test/) and cover the auth middleware, the id validator and the user repository.

## Project structure

```
index.js                 entry point: connects to MySQL, starts Express
config/                  app config and sequelize-cli config
migrations/              database migrations
src/
  app.js                 Express app, routes, error handler
  routes/                login, register, users
  middlewares/           JWT check, :id validator
  helpers/validators     email validation
  models/                Sequelize models
  repositories/users.js  user data access
  services/              DB connector, winston logger
test/                    Mocha tests
```

## Known limitations

- Passwords are stored and compared in plain text.
- The JWT secret is hard-coded in [config/default.js](config/default.js).
- [src/services/connectors/sql-connector.js](src/services/connectors/sql-connector.js) ignores `MYSQL_URI` and always connects to `db` on `localhost` as `root`/`parola`. Inside Docker the database is at host `db`, so the `node` container cannot reach MySQL until the connector uses the URI.
