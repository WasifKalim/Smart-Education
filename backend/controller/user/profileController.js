const Course = require('../../models/Course');
const Profile = require('../../models/Profile');
const User = require('../../models/User');


//update user profile
exports.profileUpdate = async (req, res) => {
    try {
        const { gender, dateOfBirth, about, contactNumber } = req.body;
        const id = req.user.id;

        //fetching data of the user
        let userDetails = await User.findById(id);

        if (!userDetails || !userDetails.additionalDetails) {
            return res.status(404).json({
                success: false,
                message: 'User or profile not found.',
            });
        }
        //   fetch profileDetails
        let profileDetails = await Profile.findById(userDetails.additionalDetails);
        if (!profileDetails) {
            return res.status(404).json({
                success: false,
                message: 'Profile not found.',
            });
        }


        /// Which value user wants to update update those only
        Object.assign(profileDetails, {
            ...(gender && { gender }),
            ...(contactNumber && { contactNumber }),
            ...(dateOfBirth && { dateOfBirth }),
            ...(about && { about })
        });
        await profileDetails.save();

        return res.status(200).json({
            success: true,
            message: 'Profile updation successful.'
        })
        //
    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Server error at Profile update.'
        })
    }
}


//delete an user  profile 

exports.deleteProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        //validation
        if (!userId) {

            return res.status(401).json({
                success: false,
                message: 'User id is missing',
            });

        }

        let userDetails=await User.findById(userId);
        if(!userDetails)
        {
            return res.status(404).json({
                success: false,
                message: 'User is not exist',
            });
        }

        //check user has any enrolled course 
        let courseDetails=userDetails.courses;
        if(courseDetails.length===0)
        {
            await User.findByIdAndDelete(userId);
            return res.status(200).json({
                success:true,
                message:'User account deleted successfully..'
            });
        }

        await Promise.all( courseDetails.map(async (perCourse)=>{
            await Course.findByIdAndUpdate(perCourse,{$pull:{studentsEnrolled:userId}});
       }))

       // delete user 
       await User.findByIdAndDelete(userId);
    return res.status(200).json({
        success:true,
        message:'User account deleted successfully..'
    })


    } catch (error) {
        console.log(error);

        return res.status(500).json({
            success: false,
            message: 'Server error at Profile delete.'
        })
    }
}