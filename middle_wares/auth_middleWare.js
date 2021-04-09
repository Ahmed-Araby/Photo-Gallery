/**
 * this file will verify the authentication of the user
 * and it will check for the authorization of the user also.
 */

const JWT = require('jsonwebtoken');
const Router = require('express').Router();

Router.use(function(req, res, next){
    const auth_header = req.header('Authorization');
    if(!auth_header){
        res.status(301).send({
            error:"user is not authenticated"
        })
        return ;
    }

    // verify the auth token data 
    const auth_data = auth_header.split(' '); // [0] is type, [1] is token.
    if(auth_data.length !=2 || auth_data[0]!='Bearer'){
        res.status(301).send({
            error:"user is not authenticated"
        })
        return ;
    }

    // verigy the token sign
    try{
        let user_payload  = JWT.verify(auth_data[1], process.env.JWT_SIGN_SECRET);
        req.user = user_payload;
    }
    catch(err){
        console.log("auth error : ", err);
        res.status(301).send({
            error:"Invalid token"
        })
        return ;
    }

    next();
})

module.exports = {auth_middleWare:Router};