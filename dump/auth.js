const express = require('express');
const app =  express();
const jwt = require('express-jwt'); // for
const jwtAuthz = require('express-jwt-authz'); // check for roles and scopes in payload of the JWT.
const jwksRsa = require('jwks-rsa'); // will query auth0 api to get the public key for my Appplication.


/**
 * this middle ware need secret to verify the incomming JWT
 * we can provide it hard coded, or use the jwks-rsa library 
 * to bring it in dynamic way.
 * 
 * then it will bring the jwt from authorization if exist,
 * then verify it.
 */
const jwtCheck = jwt({
    secret: jwksRsa.expressJwtSecret({
        cache:true, 
        rateLimit:true, 
        jwksRequestsPerMinute:5, 
        jwksUri:'https://dev-m3mxp4c0.us.auth0.com/.well-known/jwks.json'
    }) // this could be hard coded
    , 
    audience: 'https://localhost:3000/api', 
    issuer: "https://dev-m3mxp4c0.us.auth0.com/", 
    algorithms: ['RS256']
});


app.use(jwtCheck);
// have to be after jwtCheck as it need the token to be present.
app.use(  jwtAuthz([ 'write:albums' ], {customScopeKey:"permissions"})); 


app.use(function(err, req, res, next){
    console.log("error is ", err.message);
    res.json({error:err.message});
})
app.get('/authorized', (req, res)=>{
    console.log("this is a secured end point");
    res.send("you are auth user");
});

app.listen(3001, (err)=>{
    console.log("listen on 3001");
});