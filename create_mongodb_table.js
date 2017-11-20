var MongoClient = require('mongodb').MongoClient;
///got the value of host and port after starting mongodb -> mongod --dbpath=/data --port 27017
var url = "mongodb://mike1011-chatbot-5282159:27017/ordersDB";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  db.createCollection("customers", function(err, res) {
    if (err) throw err;
    console.log("DB named ordersDB and a Collection of CUSTOMERS created!");
    db.close();
  });
});