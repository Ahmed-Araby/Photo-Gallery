const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const Router = express.Router();
const upload = multer();
const storgePath = __dirname + '/../storage';
const authorize_middleWare = require('../middle_wares/authorize_middleWare').authorize_middleWare;

// tmp data, until supporting auth data.
const user_id  = 'id_1';
const album_id = 'album_1';


Router.get('/fetch', function(req, res){
    /** 
     * if we want to allow the front end to load images as urls 
     * we need to pass auth data in the cookies.
     */

    // return the image as binary data for the JS script.
    console.log("body is ", req.query);
    const album_id = req.query.albumId;
    const img_id   = req.query.imgId;
    const imgPath  = path.join(storgePath, user_id , album_id , img_id);

    res.sendFile(imgPath, function(err){
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

Router.get('/', authorize_middleWare(["read:image"]), function(req, res){
    // download the image
    const album_id = req.body.albumId;
    const img_id   = req.body.imgId;
    const imgPath  = path.join(storgePath, user_id , album_id , img_id);
    
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

Router.post('/', authorize_middleWare(['write:image']), 
                upload.single('newImg'),
function(req, res){
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

Router.put('/', async function(req, res){
    // rename the image
    const album_id = req.body.albumId;
    const old_img_id = req.body.imgId;
    const new_img_id = req.body.newImgId;

    const oldPath = path.join(storgePath, user_id, album_id, old_img_id);
    const newPath = path.join(storgePath, user_id, album_id, new_img_id);
    
    if(fs.existsSync(newPath)){
        res.status(400).json({
            success:false, 
            error:`user already have a file with this name ${new_img_id}`

        })
        return ;
    }

    fs.rename(oldPath, newPath, function(err){
        if(err){
            console.log("error in renaming image : ", err);
            res.status(404).json({
                success:false, 
                error:`Image '${old_img_id}' or Album '${album_id}' is not exist`
            })
        }
        else 
          res.json({
              success:true, 
              newImgId:new_img_id
          })
    })
})

Router.delete('/', function(req, res){
    // delete image
    
    const album_id = req.body.albumId;
    const img_id   = req.body.imgId;
    const imgPath  = path.join(storgePath, user_id , album_id , img_id);
 
    fs.unlink(imgPath, function(err){
        if(err){
            console.log("error during deleting image : ", err);
            res.status(500).json({
                success:false, 
                error:`image :'${img_id}' or album :'${album_id}' is not exist`
            });
        }
        else{
            res.json({
                success:true
            });
        }
    });
})

module.exports = {images_endPoints:Router};