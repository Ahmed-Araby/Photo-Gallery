const express = require('express');
const jwtAuthz = require('express-jwt-authz'); // check for roles and scopes in payload of the JWT.
const cors = require('cors');

const {album_endPoints} = require('./album_endPoints');
const {images_endPoints} = require('./image_endPoints');
const {auth_middleware} = require('./auth_middleware');

// initializations
const app = express();
const port = 3004;



// middle ware for cors and parsing
app.use(cors());
app.use(express.json()); // for parsing request content with type "application/json".

// middle ware for auth
//app.use(auth_middleware);

// my endPoints as Middlewares
app.use('/album', jwtAuthz(["write:albums"], {customScopeKey:"permissions"}),
                  album_endPoints);

app.use('/image', images_endPoints);

/*
// error handling have to be the last.
app.use(function(err, req, res, next){
    console.log("error is ", err.message);
    res.json({error:err.message});
})*/

app.listen(port, (err)=>{
    if(err)
        console.log("server failed");
    else 
        console.log(`server is up and running on ${port}`);
});

