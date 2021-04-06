    /*fs.readFile(imgPath, function(err, file){
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
        else 
            res.download(imgPath, function(err){
                console.log("error is :", err);
            });
    })*/