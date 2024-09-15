const express = require("express");
const app = express();


// All import route 
const courseRoute = require('./routes/coursesRoute');
const userRoute = require("./routes/userRoute"); 

// DB connection
require("dotenv").config();
const dbConnect = require("./config/db");
dbConnect();

// Json parser
app.use(express.json());
const cookie = require("cookie-parser");
app.use(cookie())

// Routes Mapping
app.use('/smartedu/api/courses', courseRoute);
app.use('/smartedu/api/user',userRoute);


// Server Connect
const PORT= process.env.PORT ||3000;

app.get('/', (req, res)=>{
    res.send("<h1>This is Home Backend Page</h1>");
})

app.listen(PORT,()=>{

    console.log(`Server Connected ${PORT}`)
});


