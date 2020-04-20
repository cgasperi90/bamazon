
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
    showItems();
  });

//Here we have a function that asks the user if they would like to make a purchase or exit the program
//If they choose to make a purchase, then the function populates the items in the database and asks which one the user would like.
function showItems() {
    inquirer.prompt([
        {
            name: "enter",
            type: "list",
            message: "Would you like to make a purchase or exit?",
            choices: ["PURCHASE", "EXIT"]
        }

    ]).then(function(answer) {

        if (answer.enter === "PURCHASE") {

            console.log("---------------------------------------------------");
            console.log("Which item would you like to purchase?");
            console.log("---------------------------------------------------");

            //Here we select all the items from the database and display them to the console.
            connection.query("SELECT * FROM products", function(err, results) {
            if (err) throw err;
            for (var i = 0; i < results.length; i++) {
                
                console.log("\tItem Number: " + results[i].item_id + 
                " | " + "Item: " + results[i].product_name + 
                " | " + "Department: " + results[i].department_name + 
                " | " + "Price: $" + results[i].price + "\n");
            }
            //The buy items function gets ran here so the user can make a selection.
            buyItems();
            });
            } else {
                console.log("---------------------------------------------------");
                console.log("Thanks for visiting!");
                console.log("---------------------------------------------------");
                connection.end();
            }
    });
}

//This function asks the user to type in the ID of the item they would like to purchase and also checks to see
//if there is enough stock to fulfill the user's order.
function buyItems() {

    //Inquirer asks the user to type in the ID of the item and to type in the quantity.
    inquirer.prompt([
        {
            name: "itemId",
            type: "input",
            message: "Type the ID number of the item you would like to purchase."
        },
        {
            name: "stock",
            type: "input",
            message: "How many of these items would you like?"
        }
    ]).then(function(answer) {

        connection.query("SELECT * FROM products", function(err, results) {
            if (err) throw err;

            //Here I created a variable that will hold the selection of the user.
            var chosenItem;
            for (var i = 0; i < results.length; i++) {
                if (results[i].item_id === parseInt(answer.itemId)) {
                    chosenItem = results[i];
                
                }
            }

            
            //This if statement compares the stock quantity in the database to the stock quantity that the user has chosen to purchase,
            //then the stock quantity in the database gets updated with the new amoount.
            //If the user chooses an amount higher than what is available, then the order will not get fullfilled.
            if (chosenItem.stock_quantity > answer.stock) {
                connection.query("UPDATE products SET ? WHERE ?", 
                [
                    {
                        stock_quantity: (chosenItem.stock_quantity - parseInt(answer.stock))
                    },
                    {
                        item_id: chosenItem.item_id
                    }
                ],
                function(err, res) {
                    if (err) throw err;

                    //Here the user gets a summary of what they have purchased and their total for the entire order.
                    console.log("---------------------------------------------------");
                    console.log("Congrats! You chose to purchase " + chosenItem.product_name +  "!");
                    console.log("---------------------------------------------------");
                    console.log("Your Order Total is $" + parseInt(answer.stock) * chosenItem.price + "\nThank you for your Purchase!");
                    console.log("---------------------------------------------------");
                    showItems();
                })
            } else {
                console.log("---------------------------------------------------");
                console.log("Sorry, we don't have that many " + chosenItem.product_name + " in stock.");
                console.log("---------------------------------------------------");
                showItems();
            }
        })
    })
}