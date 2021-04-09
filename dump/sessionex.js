const express = require('express');
const session = require('express-session');

const app = express();

let opts = {
    secret:"ploolp", 
    cookie:{path:'/home'}
}

app.use(session(opts));

app.get('/home', function(req, res){
    console.log(req.session);
    if(req.session.cnt){
        console.log("cnt is : ", req.session.cnt);
        req.session.cnt +=1;
    }
    else{
        console.log("new visitor");
        req.session.cnt = 1;
    }
    console.log("done")
    res.end("done dude");
    //res.end(req.session.cnt);
})

app.get('/index', function(req, res){
    if(req.session.cnt){
        console.log("session is shared :", req.session.cnt);
    }
    else{
        console.log("session is not shared ");
    }
    res.end("done dude");
})
app.listen(3000);
console.log("listen");