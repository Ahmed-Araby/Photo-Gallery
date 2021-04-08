const express = require('express');
const jwtAuthz = require('express-jwt-authz'); // check for roles and scopes in payload of the JWT.
const cors = require('cors');

const {album_endPoints} = require('./album_endPoints');
const {images_endPoints} = require('./image_endPoints');
const {user_endPoints} = require('./user_endPoints');

// initializations
const app = express();
const port = 3004;



app.use(cors());
app.use(express.json()); //"application/json".
app.use(express.urlencoded()); // x-www-form-urlencoded [sign up/in forms]

app.use('/album', album_endPoints);

app.use('/image', images_endPoints);

app.use('/', user_endPoints);


// error handling have to be the last.
app.use(function(err, req, res, next){
    console.log("error is ", err.message);
    res.json({error:err.message});
})

app.listen(port, (err)=>{
    if(err)
        console.log("server failed");
    else 
        console.log(`server is up and running on ${port}`);
});

