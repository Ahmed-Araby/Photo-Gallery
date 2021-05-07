const fs = require('fs');
const path = require('path');
const Router = require('express').Router();
const fastValidator = require('fastest-validator');
const validator = new fastValidator();
const bcrypt = require('bcrypt');
const {mySqlPool, mysql} = require('../utils/mySqlConn');
const generateJwtToken = require('../utils/JWT').generateJwtToken;

const salt_rounds = parseInt(process.env.SALT_ROUNDS, 10);
const storagePath = path.join(__dirname, "/../storage");

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
                const userId = results.insertId.toString();
                const userDir = path.join(storagePath, userId);
                fs.mkdir(userDir, function(err){
                    if(err){
                        res.status(500).json({
                            success:false,
                            error:"server error"
                        });
                        return ;
                    }
                    res.status(201).json({
                        success:true, 
                        id:userId,
                    })
                });
            }
        })
    })
    .catch((err)=>{
        res.status(500).json({
            success:false, 
            error:"hashing server error",
        })
    });

    return ;
})



Router.post('/signin', function(req, res){
    // validate the data 
    try{
        const scheme = {
            email:{type:"email"}, 
            password:{type:"string"}, 
            $$strict:true
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

    // authenticate the user
    let email = req.body.email;
    let password = req.body.password;
    
    const query = "select * from users where email= ?;";
    const inserts = [email];
    const preparedSqlQuery = mysql.format(query, inserts);
    
    mySqlPool.query(preparedSqlQuery, function(err, results, fields){
        if(err){
            res.status(500).json({
                success:false, 
                error:"server error "
            })
            return ;
        }
        else if(results.length==0){
            console.log("here")
            res.json({
                success:false, 
                error:"user is not registred"
            })
            return ;
        }

        
        const {id, name, password:hashedPass, email} = results[0];
        console.log(password, hashedPass)
        bcrypt.compare(password, hashedPass)
        .then((result)=>{
            if(result){
                let user = { id:id,
                             name:name, 
                             email:email,  
                             // for authorization
                             roles:["read:image", "read:album", "write:image", "write:album"],
                             exp:Date.now() / 1000 + 60 * 60
                            };
                let jwt_token = generateJwtToken(user); // only valid for 1 minute.
                //res.cookie('bearer_token', jwt_token);
                res.json({
                    success:true,
                    name:name, 
                    email:email,
                    id:id,
                    jwt_token:jwt_token
                });
            }
            else{
                res.json({
                    success:false, 
                    error:"user email or password is wrong"
                })
            }
        }) 
        .catch((err)=>{
            console.log("sign in server error " , err);
            res.status(500).json({
                success:false, 
                error:"server error please call support"
            });
        })

        return ;
    });

 })

module.exports = {user_endPoints:Router};