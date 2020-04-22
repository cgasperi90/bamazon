
//Here I have my require variables for the NPM packages.
var inquirer = require("inquirer");
var mysql = require("mysql");

//Here is where I establish my connection to MYSQL.
var connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "3730281z",
    database: "bamazon"
});

//This how we connect to MYSQL and start the program.
connection.connect(function(err) {
    if (err) throw err;
    console.log("Connected!\n");
    startProgram();
    //connection.end();
    
  });

  function startProgram() {

    inquirer.prompt([

        {
            name: "start",
            type: "list",
            message: "Choose what you would like to do.",
            choices: ["View Products For Sale", "View Low Inventory", "Add To Inventory", "Add New Product", "Exit"]
        }
    ]).then(function(answer) {

        if (answer.start === "View Products For Sale") {
            console.log("Items currently available for purchase.");
            console.log("-------------------------------------");
            productsForSale();
        } else if (answer.start === "View Low Inventory") {
            console.log("View Low Inventory");
            lowStock();
        } else if (answer.start === "Add To Inventory") {
            console.log("Add To Inventory");
            showItems();
        } else if (answer.start === "Add New Product") {
            console.log("Add New Product");
        } else {
            console.log("You have been logged out...");
            connection.end();
        }
    })
  }

  function productsForSale() {

    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        
        for (var i = 0; i < results.length; i++) {
            
            console.log("\tItem Number: " + results[i].item_id + 
            " | " + "Item: " + results[i].product_name + 
            " | " + "Department: " + results[i].department_name + 
            " | " + "Price: $" + results[i].price + 
            " | " + "Stock: " + results[i].stock_quantity + "\n");
            
        }
        startProgram();

    });
  }

  function lowStock() {

    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
    
        //var lowInventoryArr = [];
        for (var i = 0; i < results.length; i++) {
            
            if (results[i].stock_quantity <= 5) {
                console.log("-------------------------------------");
                console.log("These items have a stock count lower than 5. Please restock!\n");
                console.log("\tItem Number: " + results[i].item_id + 
                " | " + "Item: " + results[i].product_name + 
                " | " + "Department: " + results[i].department_name + 
                " | " + "Price: $" + results[i].price + 
                " | " + "Stock: " + results[i].stock_quantity + "\n");
                // lowInventoryArr.push(results[i]);
                // return lowInventoryArr;
            } else {
                console.log("-------------------------------------");
                console.log(results[i].product_name + " has " + results[i].stock_quantity + " units.");
                console.log(results[i].product_name + " has more than 5 units.");
            } 
        }
        startProgram();
    })
  }

function updateStock() {
    inquirer.prompt([
        {
            name: "update",
            type: "input",
            message: "Which item would you like to update?",
        },
        {
            name: "amount",
            type: "input",
            message: "How many of these items are you adding?"
        }
    ]).then(function(answer) {


        
        connection.query("SELECT * FROM products", function(err, results) {

            if (err) throw err;
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(answer.update)) {
                    chosenItem = results[i];
                }
            }
 

            connection.query("UPDATE products SET ? WHERE ?", 
            [
                {
                    stock_quantity: (chosenItem.stock_quantity + parseInt(answer.amount))
                },
                {
                    item_id: chosenItem.item_id
                }
            ], 
                function(err, res) {
                    if (err) throw err;

                    console.log("---------------------------------------------------");
                    console.log(chosenItem.product_name + " has been updated!");
                    console.log(chosenItem.product_name + " now has " + (chosenItem.stock_quantity + parseInt(answer.amount)) + " units.");
                    console.log("---------------------------------------------------");
                    startProgram();
                }
            )
        });
    });
}

function showItems() {
    connection.query("SELECT * FROM products", function(err, results) {
        if (err) throw err;
        

        for (var i = 0; i < results.length; i++) {
            
            console.log("\tItem Number: " + results[i].item_id + 
            " | " + "Item: " + results[i].product_name + 
            " | " + "Department: " + results[i].department_name + 
            " | " + "Price: $" + results[i].price + 
            " | " + "Stock: " + results[i].stock_quantity + "\n");
            
        }
        updateStock();

    });
}