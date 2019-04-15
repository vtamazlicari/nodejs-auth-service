# node-server
port 8080
database: mysql
start server and database: docker-compose up

route:
  /api/v1/login (login)
  /api/v1/registration (registration)
  /api/v1/users (get users)
  /api/v1/users/:id (delete user)
  /api/v1/users (post new user)
