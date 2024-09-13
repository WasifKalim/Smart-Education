const mongoose = require("mongoose");

const coursesSchema = new mongoose.Schema({
    coursesName: {
        type: String,
        require: true,
    },
    courseDescription:{
        type: String,
        require: true,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    whatYouWillLearn:{
        type: String,
        require: true
    },
    courseContent:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Section",
    },
    ratingAndReviews:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "RatingsAndReviews"
    },
    price:{
        type: Number,
        require: true
    },
    thumbnail:{
        type: String,
        require: true
    },
    tag:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tags"
    },
    studentsEnrolled:{
        type: mongoose.Schema.Types.ObjectId,
        reg: "Users"
    },

})

module.exports=mongoose.model('Courses',coursesSchema);