const mongoose = require("mongoose");
require("dotenv").config();

function dbConnect(params) {
   mongoose.connect(process.env.DB_URL)
   .then(()=>{
    console.log("DB connected");
   })
   .catch((e)=>{
    console.log("DB error:", e);
   })
}

module.exports = dbConnect;