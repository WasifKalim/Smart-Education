const mongoose = require("mongoose");

const ratingReviewsSchema = new mongoose.Schema({
    user:{
        user:{
            type: String,
            require: true,
        },
        rating:{
            type: Number,
            require: true,
        },
        review:{
            type: String,
            require: true,
        },
    }
})

module.exports = mongoose.model("RatingReviews", ratingReviewsSchema);