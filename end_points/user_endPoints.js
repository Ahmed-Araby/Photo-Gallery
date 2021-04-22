const Router = require('express').Router();
const mysql = require('mysql');
const generateJwtToken = require('../utils/JWT').generateJwtToken;

/*
let con = mysql.createConnection({
    host:"localhost",
    user:"",
    password:"",
    database:"gallery" 
})

con.connect((err)=>{
    console.log("error is : ",err);
})
*/

Router.post('/signup', function(req, res){
    /**
     * here we should save the user data into the Database
     * also make sure we do not have user with the same email before.
     */
    console.log(req.body)
    res.end("sign in up done");
})

Router.post('/signin', function(req, res){
    let email = req.body.email;
    let password = req.body.password;
 
    /**
     * here should be the Data retrival and 
     * checking of the user data against the DB
     */
    let name ="Ahmed Araby";
    let id="id_1";
    let user = { id:"id_1",
                 name:"ahmed_araby",
                 email:"ahmedaraby605@gmail.com", 
                 password:"sasasaslkjwijdoidj", // hashed
                 salt:"asasasa", 

                 // for authorization
                 roles:["read:image", "read:album", "write:image", "write:album"],
                 exp:Date.now() / 1000 + 60 * 60
                };
    // give the user JWT token.
    let jwt_token = generateJwtToken(user); // only valid for 1 minute.
    res.cookie('bearer_token', jwt_token);
    res.json({
        success:true,
        name:name, 
        email:email,
        id:id,
        jwt_token:jwt_token
    });
 })

module.exports = {user_endPoints:Router};