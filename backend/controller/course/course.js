const Category = require('../../models/Category');
const Course = require('../../models/Course');
const User = require('../../models/User');
const uploadImageToCloudinary = require('../../utiles/imageUpload');
require('dotenv').config();

// Create Course controller
exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, tags, categoryId } = req.body;
        const thumbnail = req.files.thumbnailImage;
        const instructorId = req.user.id;

        // Validation
        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tags || !thumbnail || !categoryId) {
            return res.status(400).json({
                success: false,
                message: 'Please fill all the details.'
            });
        }

        // Check if category is valid
        let categoryDetails = await Category.findById(categoryId);
        if (!categoryDetails) {
            return res.status(400).json({
                success: false,
                message: 'Invalid category.'
            });
        }

        // Cloudinary file upload
        let cloudinaryId = await uploadImageToCloudinary(thumbnail, process.env.CLOUDINARY_FOLDER_NAME);

        // Add course to database
        let courseId = await Course.create({
            courseName,
            courseDescription,
            price,
            whatYouWillLearn,
            thumbnail: cloudinaryId.secure_url,
            tags,
            instructor: instructorId
        });

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'Failed to create course.'
            });
        }

        // Add course to user database
        await User.findByIdAndUpdate(instructorId, { $push: { courses: courseId._id } }, { new: true });

        // Add course into category database
        await Category.findByIdAndUpdate(categoryId, {
            $push: { courses: courseId._id }
        });

        return res.status(200).json({
            success: true,
            message: 'Course added successfully.',
            data: courseId
        });

    } catch (error) {
        console.log(`Error in create course: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'Server error in create course.'
        });
    }
};

// Get all courses
exports.getAllCours = async (_, res) => {
    try {
        let coursesLists = await Course.find({});
        if (!coursesLists.length) {
            return res.status(404).json({
                success: false,
                message: 'No courses found.',
                data: coursesLists
            });
        }
        return res.status(200).json({
            success: true,
            message: 'Courses fetched successfully.',
            data: coursesLists
        });
    } catch (error) {
        console.log(`Error in fetch courses: ${error}`);
        return res.status(500).json({
            success: false,
            message: 'Server error in fetch courses.'
        });
    }
};

// Get course details
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.params;

        // Validation
        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: 'CourseId is missing.'
            });
        }

        let courseDetails = await Course.findById(courseId).populate({
            path: 'instructor',
            populate: {
                path: 'additionalDetails'
            }
        })
        .populate({
            path: 'courseContent',
            populate: {
                path: 'subSection'
            }
        }).populate('ratingAndReviews')
        .populate('category')
        .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: 'Course details not found for the given ID.'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Fetching successful.',
            courseDetails
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error in getting course details.'
        });
    }
};
