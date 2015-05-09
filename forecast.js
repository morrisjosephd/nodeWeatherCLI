#!/usr/bin/env node

var program = require('commander');
var request = require('request');
var chalk = require('chalk');

program
  .version('0.0.1')
  .usage('[options] <city>')
  .parse(process.argv);

var city = program.args;

var api = {
    google_api: [GOOGLE MAPS API KEY],
    forecast_api: [FORECAST.IO API KEY]
};

if(!program.args.length) {
  city = [YOUR HOME TOWN];
}

var google_url = 'https://maps.googleapis.com/maps/api/geocode/json?address=' + city + ',OH&key=' + api.google_api;

function getCoordinates() {
  request(google_url, function(error, response, body) {
    if(!error && response.statusCode === 200) {

      var body = JSON.parse(body);
      var lat = body.results[0].geometry.location.lat;
      var lng = body.results[0].geometry.location.lng;

      getWeather(lat, lng);

    } else {
      console.log('Error: ' + error);
    }

  });
}

function getWeather(lat, lng) {
  var forecast_url = 'https://api.forecast.io/forecast/' + api.forecast_api + '/' + lat + ',' + lng;
  request(forecast_url, function(error, response, body) {
    if(!error && response.statusCode === 200) {

      var body = JSON.parse(body);
      var temp = Math.round(body.currently.temperature);
      var dewpoint = Math.round(body.currently.dewPoint);

      console.log(chalk.blue.bold(city.toString().capitalizeFirstLetter() + ' weather'));
      console.log(chalk.green('Temperature: ' + temp));
      console.log(chalk.green('Dewpoint: ' + dewpoint));

    }
  });
}

String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1);
};

getCoordinates();
