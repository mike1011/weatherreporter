const express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var request = require('request');
var dotenv = require('dotenv');
var mongo = require('mongodb');
///==============MONGO DB CONFIGS============
var MongoClient = require('mongodb').MongoClient;
///got the value of host and port after starting mongodb -> mongod --dbpath=/data --port 27017
var url = "mongodb://mike1011-chatbot-5282159:27017/mydb";


// There's no need to check if .env exists, dotenv will check this // for you. It will show a small warning which can be disabled when // using this in production.
dotenv.load();

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images
//TODO - NEED TO READ THIS FILE - NON BLOCKING IO
var sample_response = __dirname + '/mock/response.json';

//////////////////////TODO - INCLUDE JS USING REQUIRE//////////////////////////////////////////////////////

var requirejs = require('requirejs');
requirejs.config({
    //Use node's special variable __dirname to
    //get the directory containing this file.
    //Useful if building a library that will
    //be used in node but does not require the
    //use of node outside
    baseUrl: __dirname,

    //Pass the top-level main.js/index.js require
    //function to requirejs so that node modules
    //are loaded relative to the top-level JS file.
    nodeRequire: require
});

//foo and bar are loaded according to requirejs
//config, and if found, assumed to be an AMD module.
//If they are not found via the requirejs config,
//then node's require is used to load the module,
//and if found, the module is assumed to be a
//node-formatted module. Note: this synchronous
//style of loading a module only works in Node.
//////////////var foo = requirejs('/js/premiumAPI');

/////////////////////////////////////////////////////////////

/////////////////var WWO_API = require('/js/premiumAPI');
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
//NOT USED===========
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

const host = 'api.worldweatheronline.com';
const wwoApi = apiai(process.env.WWO_API_KEY);
const wwoApiKey = process.env.WWO_API_KEY;


//to store session id
//NOT USED - sessionId is passed directly
global.current_session_id;

app.post('/weatherWebhook', function (req, res) {
	var data = req.body;
  console.log("WEBHOOK IS BEING CALLED FROM AI====================",data);
  ///////global.current_session_id = data.sessionId;
  	if (data.status.code === 200) {
			  // res.setHeader('Content-Type', 'application/json');
				sendFulfillmentResponse(res, true, {
					speech: 'Processing...please wait',
					displayText: 'Processing...please wait'
				});			  
			  handleFulfillmentRequest(req,res,data);
        //     res.send(JSON.stringify({ 'speech': "Processing...please wait", 'displayText': "Processing...please wait" }));
        // var speech = data.result && data.result.parameters && data.result.parameters.geo_city ? data.result.parameters.geo_city : "Seems like some problem. Speak again."
        // return res.json({
        //     speech: "Processing the request for "+speech,
        //     displayText: "Processing the request for "+speech,
        // });    
        

    } 
})	


function handleFulfillmentRequest(req, res, fulfillmentRequest) {
	var parameters = fulfillmentRequest.result.parameters;
	setTimeout(function() {
    sendEventToApiAi(fulfillmentRequest.sessionId);
    console.log("====intentionally added delay of 10 seconds");
	}, 10000); 
}


function sendEventToApiAi(sessionId) {
  var event = {
      name: "SHOW_RESULT",
      data: {
          name: "Milind",
          state: "Processing"
      }
  };
  
  var options = {
      sessionId: sessionId
  };
  
  var request = api.eventRequest(event, options);  
  
  request.on('response', function(response) {
    console.log(response.result);
  });
  
  request.on('error', function(error) {
  console.log(error);
  });
  
  request.end();

}


function sendFulfillmentResponse(res, success, payload) {
	payload.source = "FullFillment";

	res.set('Content-Type', 'application/json');

	res.status(success ? 200 : 500);
	res.send(payload);
}

app.post('/wwo', function (req, res) {
  
      var city =  req.body.message;
      var d = new Date();
      var date = d.toDateString();
      var requestUrl = 'https://api.worldweatheronline.com/premium/v1/weather.ashx?format=json&num_of_days=1' +
    '&q=' + encodeURIComponent(city) + '&key='+wwoApiKey+'&date=' + date;
      var html = "";
  
    request(requestUrl, function (error, response, body) {
        if (!error && response.statusCode == 200 ) {
            
            // parse the json result
            var result = JSON.parse(body);
            //check for valid and invalid input response 
            if(result.data.request != undefined && result.data.request[0].query.length > 0){
                //'<table style="font-size: 10px; font-family: Arial, Helvetica, sans-serif">';
                var currentWeather = result.data.current_condition;
                var weeklyWeather = result.data.weather;
    
                html += '<div class="weather-widget col-xs-12 well">';
    
                html += createCurrentWeatherHTML(currentWeather, result.data.request[0].query);
    
                weeklyWeather.forEach(function(day) {
                    html += createDaySummaryHTML(day);
                });
    
                html += '</div>';  
            }else{
              html += result.data.error[0].msg;
            }    

          res.send(html);
        } else {
           console.log(error, response.statusCode, body);
           html += "Your request could not be completed due to an internal error, please try after some time";
        }
        res.end("");
    });
});



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
