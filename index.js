//Saved in file: express_demo.js
//Express is required for creating Node.js based web apps
var express = require('express');

//body-parser is used to parse the Request body and populate the req.
var bodyParser = require('body-parser');

//mongoose is used for interacting with MongoDB
var mongoose = require('mongoose');

var app = express();
app.set('port', 3300);

//Configuring Express App to make use of BodyParser's JSON parser to parse
//JSON request body
app.use(bodyParser.json());

var dbHost = 'mongodb://localhost:27017/test';
mongoose.connect(dbHost);
//Create a schema for Book
var bookSchema = mongoose.Schema({
  name: String,
  //Also creating index on field isbn
  isbn: {type: String, index: true},
  author: String,
  pages: Number
});

//Create a Model by using the schema defined above
//Optionally one can provide the name of collection where the instances
//of this model get stored. In this case it is "mongoose_demo". Skipping
//this value defaults the name of the collection to plural of model name i.e books.
var Book = mongoose.model('Book', bookSchema);

//Connecting to Mongod instance.
mongoose.connection;

//Starting up the server on the port: 3300
app.listen(app.get('port'), function(){
  console.log('Server up: http://localhost:' + app.get('port'));
});

//Get the details of the book with the given isbn
app.get('/book/:isbn', function(req, res){
  console.log("Fetching details for book with ISBN: " + req.params.isbn);

  Book.findOne({isbn: req.params.isbn}, function(err, result){
    if ( err ) throw err;
    res.json(result);
  });
});

//Get all the books
app.get('/book', function(req, res){
  //Find all the books in the system.
  Book.find({}, function(err, result){
    if ( err ) throw err;
    //Save the result into the response object.
    res.json(result);
  });
});

//Add a new book
app.post("/book", function(req, res){
  console.log("Adding new Book: " + req.body.name);
  var book = new Book({
    name:req.body.name,
    isbn: req.body.isbn,
    author: req.body.author,
    pages: req.body.pages
  });

  //Saving the model instance to the DB
  book.save(function(err, result){
    if ( err ) throw err;
    res.json({
      messaage:"Successfully added book",
      book:result
    });
  });
});

//Update an existing book
app.put("/book/:isbn", function(req, res){
  Book.findOne({isbn: req.params.isbn}, function(err, result){
    if ( err ) throw err;

    if(!result){
      res.json({
        message:"Book with ISBN: " + req.params.isbn+" not found.",
      });
    }

    result.name   = req.body.name;
    result.isbn   = req.body.isbn;
    result.author = req.body.author;
    result.pages  = req.body.pages;

    result.save(function(err, result){
      if ( err ) throw err;
      res.json({
        message:"Successfully updated the book",
        book: result
      });
    });

  });
});

//Delete an existing book
app.delete("/book/:isbn", function(req, res){
  Book.findOneAndRemove({isbn: req.params.isbn}, function(err, result){
      res.json({
        message: "Successfully deleted the book",
        book: result
      });
  });
});