const mongoose = require("mongoose");

const ratingReviewsSchema = new mongoose.Schema({
    user:{
        user:{
            type: String,
            require: true,
            trim: true
        },
        rating:{
            type: Number,
            require: true,
            trim: true
        },
        review:{
            type: String,
            require: true,
            trim: true
        },
    }
})

module.exports = mongoose.model("RatingReviews", ratingReviewsSchema);