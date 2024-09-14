const mongoose=require('mongoose');

const UserSchema=mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    },
    accountType:{
        type:String,
        require:true
    },
    active:{
        type:Boolean,
        default:false
    },
    approve:{
        type:Boolean,
        default:false
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Courses'
    }],
    profile:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserProfile"
    },
    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'CourseProgress'
    }]
});

module.exports=mongoose.model('User',UserSchema);