/**
 * this file will verify the authentication of the user
 */

const JWT = require('jsonwebtoken');

function auth_middleWare(req, res, next){
    const auth_header = req.header('Authorization');
    //console.log("auth data : ", auth_header);
    console.log("in auth middle ware ");

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

    // verify the token sign
    try{
        // will return the user payload if verifyed, throw error not verifyed.
        let user_payload  = JWT.verify(auth_data[1], process.env.JWT_SIGN_SECRET);
        req.user = user_payload;
        
    }
    catch(err){
        console.log("auth error : ", err); // expired | invalid token
        res.status(301).send({
            error:err.message
        })
        return ;
    }

    next();
}

module.exports = {auth_middleWare};