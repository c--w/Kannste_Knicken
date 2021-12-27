const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const hbs = exphbs.create();
const http = require("http");
var server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.use(express.static(__dirname + "/"));
console.log(__dirname);

app.set("views", "./src/views");

app.get("/", function (req, res) {
  res.render("home", { layout: false });
});

server.listen(8080);
