const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();


function generateJwtToken(payload, options)
{
    const secret = process.env.JWT_SIGN_SECRET;
    let jwt_token = jwt.sign(payload, secret, {...options});
    return jwt_token;
}

/*function verify(jwt_token, secret)
{
    try{
        let payload = jwt.verify(jwt_token, secret);
        return payload;
    }
    catch(err){
        console.log("not valid token ", err);
    }
}*/


module.exports ={generateJwtToken};