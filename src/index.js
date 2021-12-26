const express = require("express");
const app = express();
const exphbs = require("express-handlebars");
const hbs = exphbs.create();

app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.set("views", "./views");

app.get("/", function (req, res) {
  res.render("home", { layout: false });
});

app.listen(8080);
