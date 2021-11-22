const jsonServer = require("json-server");
const server = jsonServer.create();
const router = jsonServer.router("./db.json");
const middlewares = jsonServer.defaults({ static: "./build" });
const port = process.env.PORT || 3004;

server.use(middlewares);
server.use("/api", router);

server.listen(port);
