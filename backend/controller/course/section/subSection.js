const SubSection = require("../../../models/SubSection");
const Section = require("../../../models/Section");

exports.courseSubSection=async(req,res)=>{
    try{
        const { sectionId, title, description } = req.body;
        const video = req.files.video;

qqq
        // Check if all necessary fields are provided
        if(!sectionId || !title || !description || !video){
            res.status(404).json({
                success:false,
                message: "All Fields are required"
            })

            // Upload the video file to Cloudinary
            const uploadDetails = await uploadImageToCloudinary(
                video,
                process.env.FOLDER_NAME
            )

            const SubSectionDetails = await SubSection.create({
                title: title,
                timeDuration: `${uploadDetails.duration}`,
                description: description,
                videoUrl: uploadDetails.secure_url,
            })

            // Update the corresponding section with the newly created sub-section
            const updatedSection = await sectionId.findByIdAndUpdate({_id: sectionId},
                {$push: { SubSection: SubSectionDetails._id}},
                {new: true}
            ).populate("subSection")

            // Return the updated section in the response
             return res.status(404).json({
                success:false,
                message: "All Fields are required"
            })
        }
    }
    catch(e){
        return res.status(500).json({
            success: false,
            message: "An error occured while updating the section"
        })
    }
}


exports.deleteSubSection = async(req, res) => {
    try{
        const { SubSectionId, sectionId } = req.body;
        await Section.findByIdAndUpdate(
            {_id: sectionId},
            {
                $pull: {
                    subSection: SubSectionId
                }
            }
        )

        const subSection = await SubSection.findByIdAndDelete({_id:subSectionId});
        if(!subSection){
            return res.status(404).json({
                success:false,
                message: "SubSection not found"
            })
        }
        return res.status(404).json({
            success:true,
            message: "SubSection deleted"
        })
    }
    catch(e){
        console.error(error)
        return res.status(500).json({
            success: false,
            message: "Error Occured in deleting Subsection"
        })
    }
}