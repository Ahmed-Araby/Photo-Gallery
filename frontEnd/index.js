 

document.getElementById('click').addEventListener('click', function(){
    alert("clicked");
    getImg();
})

function placeImg(imgId, imgUrl)
{
    document.getElementById(imgId).setAttribute('src', imgUrl);
}
function getImg()
{
    fetch('http://localhost:3004/image/fetch?albumId=album_1&imgId=beautiful_norway.jpg')
    .then(resp=>{
        if(resp.status == 200)
            return resp.blob();
        else 
            return resp.json();
    })
    .then(resp=>{
        if(resp.error){
            console.log(resp);
            return ;
        }
        
        let imgUrl = URL.createObjectURL(resp);
        console.log(imgUrl);
        placeImg('img', imgUrl);
    })
    .catch(err=> alert(err))
}