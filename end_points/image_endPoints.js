const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const authorize_middleWare = require('../middle_wares/authorize_middleWare').authorize_middleWare;

const Router = express.Router();
const upload = multer();  // for parsing images in forms.
const storgePath = __dirname + '/../storage';


/**
 * this end point will act as a static file server
 * I will use it in the <img> html tag as src for the images.
 * 
 * regards security I will get the user_id from the JWT hence, any path in the url
 * will retrive data from the user directory only.
 */

Router.get('/:albumId/:imgId',
 authorize_middleWare(['read:image']), 
    function(req, res){
        const imgPath = path.join(storgePath, req.user.id, req.params.albumId, req.params.imgId);
        res.sendFile(imgPath, function(err){
            // if this function failed would express send the headers for res.sendFile !!!!!????
            if(err){
                console.log("imgSrc error : ", err);
                res.status(404).end();
            }
        })

        // res.end(); // this line prodiuced a bug, because it ended the request 
        // before the sendFile do its work as sendFile is Async function.
        return;
    }
)

/**
 * this endpoint will allow the browser to put the image into blob
 */
Router.get('/fetch', function(req, res){
    /** 
     * if we want to allow the front end to load images as urls 
     * we need to pass auth data in the cookies.
     */

    // return the image as binary data for the JS script.
    const user_id  = req.user.id;
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


/**
 * this end point will tell the browser to prompt the user to download the image
 */
Router.get('/', authorize_middleWare(["read:image"]), function(req, res){
    // download the image
    const user_id = req.user.id;
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
                upload.single('newImg'), // this middle ware  will populate file property with the image binary data
        function(req, res){
            // save the image 
            const user_id = req.user.id;
            const album_id = req.body.albumId;
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
        }
)

Router.put('/', async function(req, res){
    // rename the image
    const user_id = req.user.id;
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
    const user_id = req.user.id;
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