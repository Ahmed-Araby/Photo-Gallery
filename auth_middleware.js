const auth_router = require('express').Router();

const jwt = require('express-jwt'); // for verifying the bearer token in the Authorization header.
const jwksRsa = require('jwks-rsa'); // will query auth0 api to get the public key for my Appplication.



// configure jwt middleware.
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




// verify the token.
auth_router.use(jwtCheck);

module.exports = {"auth_middleware":auth_router};