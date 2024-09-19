const Course = require("../../../models/Course");
const Section = require("../../../models/Section");

//create new course section
exports.createSection=async(req,res)=>{
    
   try {
     //fetch data
     const {sectionName,courseId}=req.body;

     //validation
     if(!sectionName){
         return res.status(401).json({
             success:false,
             message:'please fill section name'
         })
     };
 
     let courseSection=await Section.create({sectionName});
     let updateCourseContent=await Course.findByIdAndUpdate(courseId,{
         $push:{courseContent:courseSection._id}
     },{new:true}).populate('courseContent').exec();
 
     if(!updateCourseContent){
         return res.status(400).json({
             success:false,
             message:'Error to  add new section into course db '
         })
     }
 
     return res.status(200).json({
         success:true,
         message:'Course section added successfully.'
     });

   } catch (error) {
    console.log(error);
    
     return res.status(500).json({
         success:false,
         message:'Server error at course section.'
     })
   }
}


//update section

exports.updateSection=async(req,res)=>{
    try {
        const {sectionId,sectionName}=req.body;

    if(!sectionId || !sectionName)
    {
        return res.status(401).json({
            success:false,
            message:'PLease fill details to update your course section.'
        });
    };

    //Fetch from section db
    let updatedSection=await Section.findById(sectionId,{sectionName},{new:true});

    if(!updatedSection)
    {
        return res.status(400).json({
            success:false,
            message:'Error to update section !!'
        });
    }

    return res.status(200).json({
        success:true,
        message:'Course section updated successfully.'
    });
    } catch (error) {
        console.log(error);
    
     return res.status(500).json({
         success:false,
         message:'Server error at course update section.'
     });
    }
}

//delete a section
exports.deleteSection=async(req,res)=>{
    try {
        const{sectionId,courseId}=req.params;

        if(!sectionId || !courseId){
            return res.status(401).json({
                success:false,
                message:'PLease give sectionId and courseId to delete your course section.'
            });
        }
        //delete a section
        let section=await Section.findById(sectionId);
        if(!section)
        {
            return res.status(400).json({
                success:false,
                message:'This section is not exists into db.'
            });
        }

        await Section.findByIdAndDelete(sectionId);

        //remove from course db
        await Course.findByIdAndUpdate(courseId,{$pull:{courseContent:sectionId}},{new:true});

        return res.status(200).json({
            success:true,
            message:'Course section deleted successfully.'
        })
        

    } catch (error) {
        console.log(error);
    
     return res.status(500).json({
         success:false,
         message:'Server error at course delete section.'
     })
    }
}