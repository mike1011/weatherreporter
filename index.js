const express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var dotenv = require('dotenv');

// There's no need to check if .env exists, dotenv will check this // for you. It will show a small warning which can be disabled when // using this in production.
dotenv.load();


var apiai = require('apiai');
var path = require('path');
const uuid = require('uuid');
const bodyParser = require('body-parser');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
var port = process.env.PORT || 3000;

//uSE THIS OBJECT TO CALL THE API FROM API.AI
const api = apiai(process.env.APIAI_TOKEN);

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

//NOT USED
var options = {
    sessionId: new Date().getTime(),
    contexts: [
        {
            name: 'weather',
            parameters: {
                'geo-city': 'Mumbai'
            }
        }
    ]
};

//Call the api.ai service
app.post('/echo', function(req, res) {
var request = api.textRequest( req.body.message,options, {'sessionId': new Date().getTime()});
  request.on('response', function(response) {
    console.log("========this is the response======",response);
    res.json(response);
  });

  request.on('error', function(error) {
    console.log(error);

  });    
  
  request.end();   
    

});



//**************************************** START **********************************
//
//   TODO-   Another setup to get weather using world weather
//
//**********************************************************************************
const host = 'api.worldweatheronline.com';
const wwoApiKey = apiai(process.env.WWO_API_KEY);


function callWeatherApi (city, date) {
  return new Promise((resolve, reject) => {
    // Create the path for the HTTP request to get the weather
    let path = '/premium/v1/weather.ashx?format=json&num_of_days=1' +
      '&q=' + encodeURIComponent(city) + '&key=' + wwoApiKey + '&date=' + date;
    console.log('API Request: ' + host + path);
    // Make the HTTP request to get the weather
    http.get({host: host, path: path}, (res) => {
      let body = ''; // var to store the response chunks
      res.on('data', (d) => { body += d; }); // store each response chunk
      res.on('end', () => {
        // After all the data has been received parse the JSON for desired data
        let response = JSON.parse(body);
        let forecast = response['data']['weather'][0];
        let location = response['data']['request'][0];
        let conditions = response['data']['current_condition'][0];
        let currentConditions = conditions['weatherDesc'][0]['value'];
        // Create response
        let output = `Current conditions in the ${location['type']} 
        ${location['query']} are ${currentConditions} with a projected high of
        ${forecast['maxtempC']}°C or ${forecast['maxtempF']}°F and a low of 
        ${forecast['mintempC']}°C or ${forecast['mintempF']}°F on 
        ${forecast['date']}.`;
        // Resolve the promise with the output text
        console.log(output);
        resolve(output);
      });
      res.on('error', (error) => {
        reject(error);
      });
    });
  });
}



app.post('/test', function(req, res) {
  
  exports.weatherWebhook = (req, res) => {
    // Get the city and date from the request
    let city = "Mumbai,"//req.body.result.parameters['geo-city']; // city is a required param
    // Get the date for the weather forecast (if present)
    let date = '';
    if (req.body.result.parameters['date']) {
      date = req.body.result.parameters['date'];
      console.log('Date: ' + date);
    }
    // Call the weather API
    callWeatherApi(city, date).then((output) => {
      // Return the results of the weather API to API.AI
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': output, 'displayText': output }));
    }).catch((error) => {
      // If there is an error let the user know
      res.setHeader('Content-Type', 'application/json');
      res.send(JSON.stringify({ 'speech': error, 'displayText': error }));
    });
  };   
    

});


//**************************************** END **********************************
//
//   TODO-   Another setup to get weather using world weather
//
//**************************************   END   ****************************************


io.on('connection', function(socket){
  // socket.on('chat message', function(msg){
  //   io.emit('chat message', msg);
  // });
  socket.on('setPseudo', function (data) {
      socket.set('pseudo', data);
  });
  
  socket.on('message', function (message) {
    console.log("===========this is =====222222======",message);
      socket.get('pseudo', function (error, name) {
          var data = { 'message' : message, pseudo : name };
          socket.broadcast.emit('message', data);
          console.log("user " + name + " send this : " + message);
      })
  });  
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
