const SubSection = require("../../../models/SubSection");
const Section = require("../../../models/Section");
const uploadImageToCloudinary = require('../../../utiles/imageUpload'); // Make sure this is included

exports.courseSubSection = async (req, res) => {
    try {
        const { sectionId, title, description } = req.body;
        const video = req.files.video;

        // Check if all necessary fields are provided
        if (!sectionId || !title || !description || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required."
            });
        }

        // Upload the video file to Cloudinary
        const uploadDetails = await uploadImageToCloudinary(video, process.env.FOLDER_NAME);

        const subSectionDetails = await SubSection.create({
            title: title,
            timeDuration: `${uploadDetails.duration}`,
            description: description,
            videoUrl: uploadDetails.secure_url,
        });

        // Update the corresponding section with the newly created sub-section
        const updatedSection = await Section.findByIdAndUpdate(
            { _id: sectionId },
            { $push: { subSection: subSectionDetails._id } },
            { new: true }
        ).populate("subSection");

        // Return the updated section in the response
        return res.status(200).json({
            success: true,
            message: "Sub-section created successfully.",
            updatedSection
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating the section."
        });
    }
};

exports.deleteSubSection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;

        // Check if subSectionId is provided
        if (!subSectionId || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Sub-section ID and Section ID are required."
            });
        }

        // Update the section to remove the sub-section
        await Section.findByIdAndUpdate(
            { _id: sectionId },
            {
                $pull: {
                    subSection: subSectionId
                }
            }
        );

        const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId });
        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "Sub-section not found."
            });
        }

        return res.status(200).json({
            success: true,
            message: "Sub-section deleted successfully."
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Error occurred in deleting sub-section."
        });
    }
};
