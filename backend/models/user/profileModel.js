const mongoose=require('mongoose');

const userProfileSchema=mongoose.Schema({
    gender:{
        type:String,
        require:false,
        default:""
    },
    dob:{
        type:String,
        require:false,
        default:""
    },
    contactNumber:{
        type:Number,
        require:false,
        default:0
    },
    about:{
        type:String,
        require:false,
        default:""
    }
});

module.exports=mongoose.model('UserProfile',userProfileSchema);