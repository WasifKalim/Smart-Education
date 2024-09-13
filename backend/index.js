const express = require("express");
const app = express();

require("dotenv").config();
const dbConnect = require("./config/db");
dbConnect();

const PORT= process.env.PORT ||3000;

app.get('/', (req, res)=>{
    res.send("<h1>This is Home Page</h1>");
})

app.listen(PORT,()=>{

    console.log(`Server Connected ${PORT}`)
});


