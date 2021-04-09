const express = require('express');
const fs = require('fs'); // CRUD on the local file system.
const path = require('path');
const Router = express.Router();

// globals over the file.
const storagePath = path.join(__dirname, "/../storage");
const userId = "id_1"; // must come from the client.


Router.post('/', (req, res)=>{
    if(!req.body.new_album_name){
        res.status(400).json({
            success:false, 
            error:"request format is wrong"
        });
        return ;
    }

    let new_album_name  = req.body.new_album_name;
    let new_album_path = path.join(storagePath, userId, new_album_name);
    if(fs.existsSync(new_album_path)){
        res.status(500).json({
            success:false, 
            error:`user already have album with this name ${new_album_name}`
        });
        return ;
    }

    // validate the new name with the file system rules.
    //*** */

    fs.mkdir(new_album_path, function(err){
        if(err){
            res.status(500).json({
                success:false, 
                error:"can not create album with this name"
            });
        }
        else{
            res.status(201).json({
                success:true, 
                new_album_name:new_album_name
            });
        }
    })

})



/** 
 * return albums for the user paginated 
 * the point is to return album name and then the user can click on the album
 * in the front end  to request images inside this album.
*/
Router.get('/:pageNum', (req, res)=>{
    let pageNum = req.params.pageNum;
    // print
    console.log("request --- ", pageNum);
    
    let dirPath = path.join(storagePath, userId);
    fs.readdir(dirPath, function(err, contentList){
        // do pagination here.
        if(err)
            res.status(404).json({
                success:false, 
                error:"user do not have albums"
            });
        
        else
            res.json({
                success:"true", 
                albums:contentList
            });
    }); 
});



Router.patch("/", function(req, res){

    // validate json data
    if(!req.body.old_album_name || 
        !req.body.new_album_name){
        res.status(400).json({
            success:false, 
            error:"request format is wrong"
        });
        return ;
    }
    
    let old_album_name = req.body.old_album_name;
    let new_album_name = req.body.new_album_name;
    let oldPath = path.join(storagePath, userId, old_album_name);
    let newPath = path.join(storagePath, userId, new_album_name);

    // validate the new_album_name as to check if it follow the fileSystem naming rules.

    fs.rename(oldPath, newPath, function(err){
        if(err){
            console.log(err);
            let errorMessage = `user do not have album with the name ${old_album_name}`;
            if(err.errno == -39)
                errorMessage = `user already has album with the desired new name ${new_album_name}`;

            res.status(404).json({
                success:false, 
                error:errorMessage
                
            });
        }
        else{
            res.json({
                success:true, 
                new_album_name:new_album_name
            });
        }
    }); 
});

Router.delete('/:albumName', function(req, res){
    /**
     * albumName will always be exist other
     *  wise end point will not match */
    let albumName = req.params.albumName; 
    let album_path = path.join(storagePath, userId, albumName);
    fs.rmdir(album_path, function(err){
        if(err){
            res.status(500).json({
                success:false, 
                error:`user do not have album with this name '${albumName}'`
            });
        }
        else{
            res.json({
                success:true
            });
        }
    });

})

module.exports = {album_endPoints: Router};