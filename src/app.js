const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();
const weatherData = require("../utils/weatherData");

const port = process.env.PORT || 3001;

// Define paths for Express config
const publicPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

// Setup static directory to serve
app.use(express.static(publicPath));

// Define routes
app.get("", (req, res) => {
  // Rendering index view with optional title
  res.render("index", { title: "Weather App" });
});

app.get("/weather", (req, res) => {
  if (!req.query.address) {
    return res.send("Address is required");
  }
  weatherData(req.query.address, (error, result) => {
    if (error) {
      return res.send(error);
    }

    res.send(result);
  });
});

// Handle 404 (Not Found) page
app.get("*", (req, res) => {
  res.render("404", { title: "Page not found" });
});

// Start server
app.listen(port, () => {
  console.log("Server is listening on port " + port);
});