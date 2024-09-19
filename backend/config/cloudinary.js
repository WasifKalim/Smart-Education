const cloudianry=require('cloudinary').v2;
require('dotenv').config();
const cloudianryConnect=()=>{
    const API_KEY=process.env.API_KEY;
    const API_SECRET=process.env.API_SECRET;  
    cloudianry.config({
        cloud_name:CLOUD_NAME,
        api_key:API_KEY,
        api_secret:API_SECRET
    })
};

module.exports=cloudianryConnect;