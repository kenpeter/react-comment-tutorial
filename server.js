// NOTE: when change server code here, need to restart the node server.
// It still has front end and back end different. the console.log will be in the terminal.

var express = require("express");

// https://stackoverflow.com/questions/10011011/using-node-js-how-do-i-read-a-json-object-into-server-memory
var fs = require("fs");

var body_parser = require("body-parser");


var app = express();
var port = 3000;

var comment_file_path = __dirname + "/comment.js";

// So this is basically app.get("/")
//http://expressjs.com/en/starter/static-files.html
var static_path = __dirname + "/public";
app.use("/", express.static(static_path));

app.use(body_parser.json());
app.use(body_parser.urlencoded({extended: false}));


// So we don't expose comment.js, rather use a url for it
app.get("/api/get_comment_from_file", function(req, res){
  // https://stackoverflow.com/questions/5726729/how-to-parse-json-using-node-js
  fs.readFile(comment_file_path, function(err, data){
    if (err) throw err;
    var obj = JSON.parse(data);
    
    res.setHeader("Cache-Control", "no-cache");
    res.json(obj);
  }); 
});

app.post("/api/write_comment_to_file", function(req, res){

  fs.readFile(comment_file_path, function(err, data){
    if (err) throw err;

    // obj to json file, json.stringfy
    // json file to obj, json parse
    var comments = JSON.parse(data);
    
    // Why req.body === obj.the_author
    var the_author = req.body.the_author;
    var the_msg = req.body.the_msg;
    var the_id = req.body.id;    
    var the_time = req.body.the_time;

    // Package it
    var new_comment = {
      "id": the_id,
      "the_author": the_author,
      "the_msg": the_msg,
      "the_time": the_time
    }
    
    comments.push(new_comment);

    // https://stackoverflow.com/questions/5670752/how-can-i-pretty-print-json-using-node-js
    fs.writeFile(comment_file_path, JSON.stringify(comments, null, 4), function(err) {
      if(err) {
        console.log(err);
      } else {
        console.log("JSON saved to " + comment_file_path);
      }

      res.setHeader("Cache-Control", "no-cache");
      res.json(comments);
    });

    
  });

});


app.listen(port, function(){
  console.log("Listening port: " + port);
});


