# Photo-Gallery
Photo-Gallery app (Like google drive, but only for images)

## Architecture Diagram (Simple):
![Architecture_Diagram](https://github.com/Ahmed-Araby/Photo-Gallery/blob/master/dump/photo-gallery_Architecture_Diagram.png)


## technologies used till now:
* Node js
* Express
* JWT for user authentication and authorization.

## Features:
* Create Albums 
* Upload images into Albums.
* DownLoad Individual Images
* DownLoad A whole Albums at once (compressed)
* 

## To Do - Back-End:
- [X] user SignUp / Sign In end points
- [X] authenticate the user using JWT (build JWT, Verify JWT)
- [X] Authentication and Authorization Middle Wares.
- [X] Album CRUD EndPoints.
- [X] Images Crud EndPoints.  
- [ ] Build Data Base to store user information.
- [ ] change the storage from teh server file System to Object store (local object store data base | AWS S3 | ...) [for learning purpose].
- [ ] connect the server to MySql data base Hosted on AWS EC2 Instance ( for 1 day )
- [ ] Host the server IN AWS EC2 instance ( for 1 day )

## To Do - front-End:
- [ ] enable user to create album.
- [ ] display the albums paginated.
- [ ] enable user upload image into the server.
- [ ] display images of a specifc album paginated. 
- [ ] allow user to download an image.
- [ ] allow the user to download a complete album at once.
- [ ] save the jwt token into browser session storage.
- [ ] HOST the Front-End in AWS for 1 day.
- [ ] Learn CSS and Material UI then try to Make Professional UI.
