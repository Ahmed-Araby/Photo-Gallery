// have to be in the very first.
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const jwtAuthz = require('express-jwt-authz'); // check for roles and scopes in payload of the JWT.
const cors = require('cors');

const {album_endPoints}  = require('./end_points/album_endPoints');
const {images_endPoints} = require('./end_points/image_endPoints');
const {user_endPoints}   = require('./end_points/user_endPoints');

const {auth_middleWare} = require('./middle_wares/auth_middleWare');


// initializations
const app = express();
const port = 3004;



app.use(cors());
app.use(express.json()); //"application/json".
app.use(express.urlencoded()); // x-www-form-urlencoded [sign up/in forms]
app.use((req, res, next)=>{
    const env = process.env.NODE_ENV || "dev";
    if(env == "dev")
        res.setHeader('Cache-Control', 'no-store');
    next();
    
})

 
app.use('/album', auth_middleWare, album_endPoints);

app.use('/image', auth_middleWare, images_endPoints);

app.use('/', user_endPoints);

// error handling have to be the last.
app.use(function(err, req, res, next){
    res.json({
        error:err.message,
        from:"error handler middleWare",
    });
})

/** handle 404 not found */
app.use(function(req, res){
    res.status(404).json({
        error:"not Found"
    })
})

app.listen(port, (err)=>{
    if(err)
        console.log("server failed");
    else 
        console.log(`server is up and running on ${port}`);
});

