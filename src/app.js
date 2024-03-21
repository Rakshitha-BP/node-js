const express = require("express");
const hbs = require("hbs");
const path = require("path");

const app = express();
const weatherDataUtil = require("../utils/weatherData"); // Renamed to avoid variable name conflict

// Define routes and middleware here

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

// Route to handle weather data for multiple locations
app.get('/weather', async (req, res) => {
    const locations = req.query.locations;
    if (!locations) {
        return res.status(400).json({ error: 'Locations parameter is required' });
    }
    const locationsArray = locations.split(',');
    const weatherData = await weatherDataUtil.fetchWeatherData(locationsArray); // Assuming this function exists in weatherData module
    res.json(weatherData);
});

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
  weatherDataUtil(req.query.address, (error, result) => { // Assuming this function exists in weatherData module
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
