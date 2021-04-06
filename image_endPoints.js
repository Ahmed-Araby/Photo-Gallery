const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Router = express.Router();
const upload = multer();
const storgePath = __dirname + '/storage';


// tmp data, until supporting auth data.
const user_id  = 'id_1';
const album_id = 'album_1';

Router.get('/', function(req, res){
    // download the image
    const album_id = req.body.albumId;
    const img_id = req.body.imgId;
    const imgPath =path.join(storgePath, user_id , album_id , img_id);
    
    // this funcetion wll set the header aith attachment
    // to tell the browser to prompt the user to download the file.

    res.download(imgPath, function(err){
        if(err){
            console.log("error during sending image back to the user:\n", err)
            if(err.errno == -2)
                res.status(404).json({
                    success:false,
                    error:`image :'${img_id}' or album :'${album_id}' is not exist`
                });
            else
                res.status(500).json({
                    success:false,
                    error:`internal Server Error`
                });
        }
    });
})

Router.post('/', upload.single('newImg'), function(req, res){
    // save the image 
    const imgPath =path.join(storgePath, user_id , album_id , req.file.originalname); 
    try{
        fs.writeFileSync(imgPath, req.file.buffer);
        res.status(201).json({
            success:true, 
            imgpath: path.join(user_id , album_id , req.file.originalname)
        });
    }
    catch (err){
        res.status(500).json({
            success:false, 
        })
    }
})

Router.put('/', function(req, res){
    // rename the image
})

Router.delete('/', function(req, res){
    // delete image
})

module.exports = {images_endPoints:Router};