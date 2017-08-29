const express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var apiai = require('apiai');
var path = require('path');
const uuid = require('uuid');


var port = process.env.PORT || 3000;

var api = apiai("0ade18739a7740048c78b3e509d1d688");

app.use(express.static(__dirname + '/views')); // html
app.use(express.static(__dirname + '/public')); // js, css, images


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});



app.post('/echo', function(req, res) {
    var speech = req.body.result && req.body.result.parameters && req.body.result.parameters.echoText ? req.body.result.parameters.echoText : "Seems like some problem. Speak again."
    return res.json({
        speech: speech,
        displayText: speech,
        source: 'chatbot-mike1011.c9users.io'
    });
});



app.post('/slack-test', function(req, res) {

    var slack_message = {
        "text": "Details of JIRA board for Browse and Commerce",
        "attachments": [{
            "title": "JIRA Board",
            "title_link": "http://www.google.com",
            "color": "#36a64f",

            "fields": [{
                "title": "Epic Count",
                "value": "50",
                "short": "false"
            }, {
                "title": "Story Count",
                "value": "40",
                "short": "false"
            }],

            "thumb_url": "https://stiltsoft.com/blog/wp-content/uploads/2016/01/5.jira_.png"
        }, {
            "title": "Story status count",
            "title_link": "http://www.google.com",
            "color": "#f49e42",

            "fields": [{
                "title": "Not started",
                "value": "50",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }, {
                "title": "Development",
                "value": "40",
                "short": "false"
            }]
        }]
    }
    return res.json({
        speech: "speech",
        displayText: "speech",
        source: 'chatbot-mike1011.c9users.io',
        data: {
            "slack": slack_message
        }
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
