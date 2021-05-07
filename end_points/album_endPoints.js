const express = require('express');
const fs = require('fs'); // CRUD on the local file system.
const path = require('path');
const Router = express.Router();

// globals over the file.
const storagePath = path.join(__dirname, "/../storage");
const ALBUM_PER_PAGE = parseInt(process.env.ALBUM_PER_PAGE, 10);

/**
 * - this end point will revcieve json data
 *   in the body.
 * 
 * - create album 
 * 
 * - respond with success or failure
 */


Router.post('/', (req, res)=>{

    console.log("create album endPoint ");

    if(!req.body.new_album_name){
        res.status(400).json({
            success:false, 
            error:"request format is malformed"
        });
        return ;
    }

    const userId = req.user.id.toString();
    let new_album_name  = req.body.new_album_name;
    let new_album_path = path.join(storagePath, userId, new_album_name);
    if(fs.existsSync(new_album_path)){
        res.status(400).json({
            success:false, 
            error:`user already have album with this name :${new_album_name}`
        });
        return ;
    }

    // validate the new name with the file system rules.
    //*** */

    fs.mkdir(new_album_path, function(err){
        if(err){
            console.log("mkdir error : ", err);
            res.status(500).json({
                success:false, 
                error:"server error, un able to create album with this name"
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
*/
Router.get('/:pageNum/:albumsPerPage', (req, res)=>{

    console.log("get paginated albums end point ")
    
    const userId = req.user.id.toString();
    let pageNum=0;
    let albumsPerPage = 0;    
    pageNum = parseInt(req.params.pageNum, 10);
    albumsPerPage = parseInt(req.params.albumsPerPage, 10);

    // get albums
    let dirPath = path.join(storagePath, userId);
    fs.readdir(dirPath, function(err, contentList){
        if(err)
            res.status(404).json({
                success:false, 
                error:"user do not have albums"
            });
        
        else{
            
            let subContentList = contentList.slice(pageNum * albumsPerPage,
                                pageNum * albumsPerPage + albumsPerPage);
            subContentList = subContentList.map((name, index)=>{
                return {
                    name:name,
                    description:"* my family photos", 
                    id:pageNum*albumsPerPage + index
                }
            });
            res.json({
                success:"true", 
                albums:subContentList
            });
        }
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
    const userId = req.user.id;
    let old_album_name = req.body.old_album_name;
    let new_album_name = req.body.new_album_name;
    let oldPath = path.join(storagePath, userId, old_album_name);
    let newPath = path.join(storagePath, userId, new_album_name);

    // validate the new_album_name, 
    //to check if it follow the fileSystem naming rules.

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
    
    const userId = req.user.id;
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