const fs = require("fs");
const path = require('path');

let p = path.join(__dirname, 'newAlbum');
fs.rmdir(p, function(err){
    console.log("error is :\n", err);
})