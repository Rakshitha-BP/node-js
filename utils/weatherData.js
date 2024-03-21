const request = require("request");

const openWeatherMap = {
  BASE_URL: "https://api.openweathermap.org/data/2.5/weather?q=",
  SECRET_KEY: "4c1662cced50d6d4f3b9d94996c4d5cf",
};

const weatherData = (address, callback) => {
  const url =
    openWeatherMap.BASE_URL +
    encodeURIComponent(address) +
    "&APPID=" +
    openWeatherMap.SECRET_KEY;
  console.log(url);
  request({ url, json: true }, (error, data) => {
    if (error) {
      callback(true, "Unable to fetch data, Please try again. " + error);
    }
    callback(false, data?.body);
  });
};

const https = require('https');

async function fetchWeatherData(locations) {
    const weatherData = {};
    for (const location of locations) {
        try {
            const response = await fetchWeather(`https://api.openweathermap.org/data/2.5/weather?q=?location=${location}`);
            if (!response.ok) {
                weatherData[location] = { error: 'Invalid location' };
            } else {
                const data = await response.json();
                weatherData[location] = data;
            }
        } catch (error) {
            weatherData[location] = { error: 'Failed to fetch data' };
        }
    }
    return weatherData;
}

function fetchWeather(url) {
    return new Promise((resolve, reject) => {
        https.get(url, response => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error(`Failed to load page, status code: ${response.statusCode}`));
            }
            const body = [];
            response.on('data', chunk => body.push(chunk));
            response.on('end', () => resolve(JSON.parse(body.join(''))));
        }).on('error', error => reject(error));
    });
}

module.exports = fetchWeatherData;


module.exports = weatherData;