
// Requiring the dependencies
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const _ = require('lodash');

// Starting Content of all the pages
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

// Using an app in express
const app = express();

// Telling ejs to look in the view folder for the ejs files
app.set('view engine', 'ejs');

// Using bodyParser for passing data from pages to server
app.use(bodyParser.urlencoded({extended: true}));

// Specifing the server to look for css and other files
app.use(express.static("public"));

// connecting to the mongoDB atlas server.
mongoose.connect("mongodb://<userName>:<password>@cluster0-shard-00-00.ynkro.mongodb.net:27017,cluster0-shard-00-01.ynkro.mongodb.net:27017,cluster0-shard-00-02.ynkro.mongodb.net:27017/blogDB?ssl=true&replicaSet=atlas-uayq94-shard-0&authSource=admin&retryWrites=true&w=majority", { useNewUrlParser: true , useUnifiedTopology: true, useFindAndModify : false});

// creating a schema for the Posts collection.
const postSchema = new mongoose.Schema({
  title : String,
  body : String
})

// creating post model.
const Post = mongoose.model("Post", postSchema);


// Setting a get request from the browser for the home route
app.get("/", function(req, res){
  Post.find(function(err, posts){
    if(err)
      console.log(err);
    else
      res.render("home", {homeStartingContent : homeStartingContent , posts : posts});
  });
});


// Setting a get request from the browser for the about route
app.get("/about", function(req, res){
  res.render("about", {
    aboutContent : aboutContent
  });
});


// Setting a get request from the browser for the contact route
app.get("/contact", function(req, res){
  res.render("contact", {
    contactContent : contactContent
  });
});


// Setting a get request from the browser for the compose route
app.get("/compose", function(req, res){
  res.render("compose");
});


// Setting a post request from the browser for the compose route
app.post("/compose", function(req, res){

  // Creating a javascript object from the post request of compose route
  const postDoc = new Post({
    title : req.body.postTitle,
    body : req.body.postBody
  });

  // Adding my post to the posts collection
  postDoc.save();

  // Now redirecting to the home route to so that I can see my posts
  res.redirect("/");
});


// Useing custom title to find the posts if written.
app.get("/posts/:pTitle", function(req, res){
  let requestedTitle = req.params.pTitle;
  Post.findOne({title : requestedTitle}, function(err, foundPost){
    if(!err){
      if(!foundPost){
        console.log("Post not found!");
        res.redirect("/");
      }else{
        res.render("post", {
          postPageTitle : foundPost.title,
          postPageContent : foundPost.body
        });
      }
    }
  });
});

// Listening on the port.
let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started...");
});
