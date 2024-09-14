const express = require("express");
const app = express();


// All import route 
const courseRoute = require('./routes/coursesRoute');
const userRoute = require("./routes/userRoute"); 

// DB connection
require("dotenv").config();
const dbConnect = require("./config/db");
dbConnect();


// Routes Mapping
app.use('/courses/api', courseRoute);
app.user('/user/api',userRoute);


// Server Connect
const PORT= process.env.PORT ||3000;

app.get('/', (req, res)=>{
    res.send("<h1>This is Home Backend Page</h1>");
})

app.listen(PORT,()=>{

    console.log(`Server Connected ${PORT}`)
});


