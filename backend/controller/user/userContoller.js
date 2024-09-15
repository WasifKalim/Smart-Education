const bcrypt = require("bcrypt")
const User = require("../../models/user/userModel")
const jwt = require("jsonwebtoken");
const { sendMail } = require("../../utiles/mail");
const otpGenerator=require('otp-generator');
const OTP = require("../../models/OTP");
const Profile = require("../../models/Profile");
require("dotenv").config();

//Send otp
exports.sendOtp=async(req,res)=>{
    try {
         const {email}=req.body;

         let user=await User.findOne({email});
         if(user)
         {
            return res.status(401).json({
                success:true,
                message: "Email already registered"
            })
         }

         let otp=otpGenerator.generate(6,{
            lowerCaseAlphabets:false,
            upperCaseAlphabets:false,
            specialChars:false
         });

         //check otp is present or not
         let isPresent=await OTP.findOne({otp:otp});

         while(isPresent)
         {
            otp=otpGenerator.generate(6,{
                lowerCaseAlphabets:false,
                upperCaseAlphabets:false,
                specialChars:false
             });
             isPresent=await OTP.findOne({otp:otp});
         }

         let response=await OTP.create({
            email,
            otp
         });

         if(!response)
         {
            return res.status(400).json({
                success: false,
                message: "Failed to save otp into database"
            }) 
         }
         return res.status(200).json({
            success: true,
            message: "OTP added into database successfully."
        })

    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success:false,
            error:e,
            message: "Server Error at OTP mail"
        })
    }
}




exports.userSignup = async(req, res) =>{
    try{
        const {firstName, lastName, otp, email, password, accountType} = req.body;

        // Validate
        if(!firstName || !lastName  || !otp || !email || !password || !accountType ){
            return res.status(403).json({
                success: false,
                message: "Please fill all the details properly!"
            })
        }

        const user = await User.findOne({email});

        if(user){
            return res.status(200).json({
                success: true,
                message: "Email already registered"
            })
        }


        ///Verify otp 
        let isOtpMatched=await OTP.findOne({email}).sort({createdAt:-1}).limit(1);
        if(!isOtpMatched){
            return res.status(400).json({
                success: false,
                message: "Invalid otp!"
            })
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const profile=await Profile.create({
            gender:null,
            dateOfBirth:null,
            contactNumber:null,
            about:null
        });

        //create avatar according to your name:
        let imageUrl=`https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`;
     let response=await User.create({
        firstName,
        lastName,
        email,
        password:hashPassword,
        accountType,
        additionalDetails:profile._id,
        image:imageUrl
     });
     
        if(response){
            return res.status(200).json({
                success:true,
                data: response.data,
                message: "Account created Successfully"
            })
        }

        return res.status(400).json({
            success: false,
            message: "Failed to create account"
        })
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success:false,
            error:e,
            message: "Server Error in SignUp"
        })
    }
}


exports.userLogin = async(req, res) => {
    try{
        const {email, password} = req.body;

        // Validate
        
        let user = await User.findOne({email});
        
        if(!user){
            return res.status(200).json({
                success: false,
                message: "Please SignUp"
            })
        }
        
        const passwordMatched = await bcrypt.compare(password, user.password);

        if(passwordMatched){
            const payload = {
                email: user.email,
                id: user._id,
                name: user.name
            }

            const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: "2h"} );

            const options = {
                expires: new Date(Date.now() + 3 * 24 *60 * 60)
            }

            res.cookie("token", token, options).status(200).json({
                success: true,
                user: user.name,
                token: token,
                message: "Login successful..."
            })
        }
        else{
            return res.status(400).json({
                success: false,
                message: "Password Does not Match"
            })
        }
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Server Error in login",
            error: e
        })
    }
}

// ChangePassword Controller
exports.changePassword = async(req, res)=>{
    try{
        const{email, currentPassword, newPassword} = req.body;

        const isEmail = await User.findOne({email});
        let checkPassword = await bcrypt.compare(currentPassword, isEmail.password);
        if(!checkPassword){
            return res.status(400).json({
                success: false,
                message: "Incorrect Current Password"
            })
        }

        let hashPassword = await bcrypt.hash(newPassword, 10);

        let result = await User.findOneAndUpdate({email},{ password: hashPassword});
        if(!result){
            return res.status(400).json({
                success: false,
                message: "Failed to change password",
            })
        }
        return res.status(200).json({
            success: true,
            message: "Password Updated Successfully"
        })
    }
    catch(e){
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Server Error in ChangePassword",
        })
    }
}