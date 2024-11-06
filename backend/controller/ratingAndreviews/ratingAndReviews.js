const RatingAndRaview = require("../../models/RatingAndRaview");
const Course=require('../../models/Course');
const User=require('../../models/User');


//create Rating and reviews
exports.createRatingandReviews=async(req,res)=>{
   try {
    const{courseId,rating,review}=req.body;
    const userId=req.user.id;

    //validation
    if(!userId ||  !courseId || !rating || !review){
        return res.status(400).json({
            success: false,
            message: 'Please fill all details.'
        })
    }

    //check user is enrolled or not
    let checkEnrolled=await Course.findOne({
        _id:courseId,
        studentsEnrolled:{
            $eleMatch:{
                $eq:{userId}
            }
        }
    });

    if(!checkEnrolled){
        return res.status(403).json({
            success:false,
            message:"You have not enrolled this course yet.."
        });
    }
    //check if user already has given his or her rating and reviews
        let checkUser=await RatingAndRaview.findOne({
            user:userId,
            course:courseId
        })

        if(checkUser){
            return res.status(403).json({
                success:false,
                message:"You have already given a review and ratings."
            });
        }
            // Check if the course and user exist
            const courseExists = await Course.findById(courseId);
            const userExists = await User.findById(userId);
    
            if (!courseExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Course not found.'
                });
            }
    
            if (!userExists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found.'
                });
            }
    
    //create rating and reviews
    let reviewId=await RatingAndRaview.create({
        user:userId,
        rating,
        review,
        course:courseId
    });

    if(!reviewId)
    {
        return res.status(403).json({
            success: false,
            message: 'Failed to insert rating and reviews into db'
        });
    }

    //update course model 
    await Course.findByIdAndUpdate(courseId,{
        $push:{
            ratingAndReviews:reviewId._id
        }
    },{new:true});

    return res.status(201).json({
        success: true,
        message: 'Rating and reviews created successfully for the course.'
    });
    
   } catch (error) {
    console.log(error);
    
    return res.status(500).json({
        success: false,
        message: 'Internal server error in ratingandreviews creation'
    });
   }
}

//getAverageRating of a course
exports.getAverageRating=async(req,res)=>{
    try {
        const {courseId}=req.params;
        
        //validation
        if(!courseId)
        {
              
    return res.status(400).json({
        success: false,
        message: 'Course Id is missing!!'
    });
        }

    //check course is present or not
    let CourseDetails=await Course.findById(courseId);
    if(!CourseDetails)
    {
      return res.status(404).json({
          success: false,
          message: 'Course Not found !!'
      });

    }
    let averageRating=await RatingAndRaview.aggregate[
        {
            $match:{
                course:courseId
            }
        },
        {
            $group:{
                _id:null,
                average:{
                    $avg:'$rating'
                }
            }
        }
    ];
    if(averageRating.length>0)
    {
        return res.status(200).json({
            success:true,
            averageRating:averageRating[0].average
        })
    }
    return res.status(200).json({
        success:true,
        message:'till now no one has given any rating and reviews..'
    })
 } 
 //error handle
 catch (error) {
        console.log(error);
          
    return res.status(500).json({
        success: false,
        message: 'Internal server error in getAveargeRating'
    });
    }
}

exports.getAllRating = async(req, res) => {
    try{
        const allReviews = await ratingAndReview.find({}).sort({rating: "desc"}).populate({
            path: "user",
            select: "firstName lastName email image"
        })
        .populate({
            path:"course",
            select: "courseName",
        })
        .exec();

        return res.status(200).json({
            success:true,
            message: "All reviews fetched successfully",
            data: allReviews,
        })
    }

    catch(error){
        console.log(error);
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}