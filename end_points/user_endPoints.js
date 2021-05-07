const Router = require('express').Router();
const fastValidator = require('fastest-validator');
const validator = new fastValidator();
const bcrypt = require('bcrypt');
const {mySqlPool, mysql} = require('../utils/mySqlConn');
const generateJwtToken = require('../utils/JWT').generateJwtToken;

const salt_rounds = parseInt(process.env.SALT_ROUNDS, 10);

Router.post('/signup', function(req, res){

    // validate request data 
    console.log("body : ", req.body);
    try{
        const scheme={
            name:{type:"string", }, 
            email:{type:"email"}, 
            password:{type:"string", min:10, max:50},
            $$strict:true, // no additional props are allowed.
        }
        validator.validate(req.body, scheme);
    }
    catch(err){
        res.status(400).json({
            success:false, 
            error:"request data is malformed"
        });
        return ;
    }

    const name = req.body.name;
    const email = req.body.email;
    const pass = req.body.password;
    const salt = "-------";

    // save data into the DB
    bcrypt.hash(pass, salt_rounds)  // auto salt generation
    .then((hash)=>{
        const query = "insert into users (name, email, password, salt) values(?, ?, ?, ?)"
        const inserts = [name, email, hash, salt];
        const preparedQuery = mysql.format(query, inserts);
        mySqlPool.query(preparedQuery, function(err, results, fields){
            if(err){
                res.status(500).json({
                    success:false, 
                    error:err.message
                })
            }
            else{
                const rowId = results.insertedId;
                res.status(201).json({
                    success:true, 
                    id:rowId,
                })
            }
        })
    })
    .catch((err)=>{
        console.log("hasing password failed : ", err)
    });
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