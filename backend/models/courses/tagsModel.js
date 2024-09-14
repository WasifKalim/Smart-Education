const mongoose = require("mongoose");

const tagsSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Courses",
    },
    
})

module.exports = mongoose.model("Tags", tagsSchema);