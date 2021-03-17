// require 
const express = require('express');
const {album_endPoints} = require('./album_endPoints');

// initializations
const app = express();
const port = 3004;

// middle ware for auth

// middle ware for cors and parsing
app.use(express.json()); // for parsing request content with type "application/json".

// my endPoints as Middlewares
app.use('/album', album_endPoints);

app.listen(port, (err)=>{
    if(err)
        console.log("server failed");
    else 
        console.log(`server is up and running on ${port}`);
});
