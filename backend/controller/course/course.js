const Category = require('../../models/Category');
const Course=require('../../models/Course');
const User=require('../../models/User');
const uploadImageToCloudinary = require('../../utiles/imageUpload');
require('dotenv').config();
//Create Course controler

exports.createCourse=async(req,res)=>{

    try {
        const{courseName,courseDescription,whatYouWillLearn,price,tag}=req.body;
        const thumbnail=req.files.thumbnailImage;
        const instructorId=req.user.id;
        //validation
        if(!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !thumbnail){
            res.status(400).json({
                success:false,
                message:'Please fill all the details..'
            });
        }
         
        //check tag is valid or not 
        let tagDetails=await Category.findById(tag);
        if(!tagDetails)
        {
            res.status(400).json({
                success:false,
                message:'Invalid category..'
            });
        }
        //Cloudinary file upload
        let cloudinaryId=await uploadImageToCloudinary(thumbnail,process.env.CLOUDINARY_FOLDER_NAME);
        //add Course to database
        let courseId=await Course.create({
            courseName,
            courseDescription,
            price,
            whatYouWillLearn,
            thumbnail:cloudinaryId.secure_url,
            tag:tag,
            instructor:instructorId
        }) ;

        if(!courseId)
            {
                res.status(400).json({
                    success:false,
                    message:'Invalid category..'
                });
            }
        //add course to user db
             await User.findByIdAndUpdate(instructorId,{$push :{courses:courseId._id}},{new:true});

             //add course into tag db
             await Category.findByIdAndUpdate(tag,{
                $push :{
                    courses:courseId._id
                }
             });

             return res.status(200).json({
                success:true,
                message:'Course added successfully..',
                data:courseId
             })

    } catch (error) {
        console.log(`error in create course ${error}`);
        return res.status(500).json({
            success:false,
            message:'server error in create course'
        })
    }

};


//get all course
exports.getAllCours=async(req,res)=>{
    try {
        let coursesLists=await Course.find({});
        if(!coursesLists)
        {
            return res.status(401).json({
                success:false,
                message:'No course found..',
                data:coursesLists
             })
        }
        return res.status(200).json({
            success:true,
            message:'Course fetched successfully..',
            data:coursesLists
         })
    } catch (error) {
        console.log(`error in fetch course ${error}`);
        return res.status(500).json({
            success:false,
            message:'server error in fetch course'
        }) 
    }
};