var http = require('http');
var express = require('express');
var path = require('path');

var app = express();

const PORT = 3000;
const PATH = path.join(__dirname, "..", "build");

app.use(express.static(PATH));

app.get('/', function(request, response) {
    console.log("Executing spyle");
    response.sendFile(path.join(PATH, "spayle.html"));
});

http.createServer(app).listen(PORT);
console.log("Server running.");
console.log("Ready to play: Type in \"localhost:3000\" in your favourite browser.");