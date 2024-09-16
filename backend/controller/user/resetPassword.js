const User=require('../../models/User');
const mailSender=require('../../utiles/mail');
const bcrypt=require('bcrypt');
exports.resetPasswordLink=async(req,res)=>{
    try {
        const {email}=req.body;

        //check user is present or not
        let user=await User.findOne({email});
   
        if(!user){
           return res.status(401).json({
               success:false,
               message:'Email is not registered yet'
           });
        }

        const token=crypto.randomUUID();

        //save token in database
        let response=await User.findOneAndUpdate({email},{
            token,
            resetPasswordExpires:Date.now()+5*60*1000
        });

        if(!response){
            return res.status(401).json({
                success:false,
                message:'Error to save reset  token into Db'
            });
        }
        //create resetUrl Link
        let resetUrl=`http://localhost:5173/update-password/${token}`;

        //send url to user gmail
        await mailSender(email,
            'Password reset link',
            `Please click this link to reset your password..${resetUrl}`
        )
        return res.status(200).json({
            success:true,
            message:'Check your mail to reset your password'
        });

    } catch (error) {
        return res.status(500).json({
            success:false,
            message:'Server error at reset-password link creation!!'
        });
    }
}



///Reset password
exports.resetPassword=async(req,res)=>{
    const{password,token}=req.body;
    
    //check whethere token is valid or invalid
    let user=await User.findOne({token});

    if(!user)
    {
        return res.status(401).json({
            success:false,
            message:'Token is invalid!'
        });
    }

    if(user.resetPasswordExpires >Date.now()){
        return res.status(400).json({
            success:false,
            message:'Link expired.'
        });
    }
    //hashing your pass
    let hashPassword=await bcrypt.hash(password,10);
    let updatePass=await User.findOneAndUpdate({_id:user._id},{
        password:hashPassword
    });

    if(!updatePass){
        return res.status(400).json({
            success:false,
            message:'Error to update pass into db'
        });
    }
    await mailSender(user.email,"Password reset update","Your password  reset is successful.");
    return res.status(200).json({
        success:true,
        message:'Password reset successfull'
    });
}