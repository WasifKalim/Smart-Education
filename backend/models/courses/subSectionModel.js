const mongoose = require("mongoose");

const SubSectionSechma = new mongoose.Schema({
    title:{
        type: String,
        require: true,
        trim: true
    },
    timeDuration:{
        type: String,
        require: true,
        trim: true
    },
    description:{
        type: String,
        require: true,
        trim: true
    },
    videoUrl:{
        type: String,
        require: true,
    },
    additionalUrl:{
        type: String,
        require: true,
    }
});

module.exports = mongoose.model("SubSection", SubSectionSechma);