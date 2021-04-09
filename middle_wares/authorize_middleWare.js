
function authorize_middleWare(required_roles){
    return function(req, res, next){
        // access roles throw closure.
        const user_roles = req.user.roles;
        
        for(let role of required_roles){
            if(!user_roles.includes(role)){
                res.status(302).send({
                    error:"user is not authorized"
                })
                return ;
            }
        }

        next();
    }
}

module.exports = {authorize_middleWare}