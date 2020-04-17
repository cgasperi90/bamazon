var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "127.0.0.1",
    user: "root",
    password: "3730281z"
});

connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });