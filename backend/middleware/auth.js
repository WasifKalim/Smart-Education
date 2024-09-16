const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/User");

// auth
exports.auth = async(req, res, next) => {
    try{
        // extract token
        const token = req.cookies.token || req.body.token || req.header("Authorisation").replace("Bearer", "");

        // if token missing 
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Token is missing"
            });
        }

        // verify the token
        try{
            const decode = jwt.verify(token, process.env.JWT_SECRET);
            console.log(decode);
            req.user = decode;
        }
        catch(e){
            return res.status(401).json({
                success: false,
                message: 'token is invalid'
            });
        }
        next();
    }
    catch(e){
        console.log(e);
        return res.status(401).json({
            success: false,
            message: 'Authorisation is invalid'
        });
    }
}

// Instructor
exports.isAdmin = async(req, res)=>{
    try{
        console.log("Printing AccountType ", req.user.accountType);
        if(req.user.accountType !== "Admin"){
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Admin only',
            });
        }
        next();
    }
    catch(e){
        return res.status(401).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })
    }
}


// Student
exports.isStudent = async(req, res)=>{
    try{
        console.log("Printing AccountType ", req.user.accountType);
        if(req.user.accountType !== "Student"){
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Student only',
            });
        }
        next();
    }
    catch(e){
        return res.status(401).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })
    }
}


// Instructor
exports.isInstructor = async(req, res)=>{
    try{
        console.log("Printing AccountType ", req.user.accountType);
        if(req.user.accountType !== "Instructor"){
            return res.status(401).json({
                success: false,
                message: 'This is a protected route for Instructor only',
            });
        }
        next();
    }
    catch(e){
        return res.status(401).json({
            success: false,
            message: "User role cannot be verified, please try again"
        })
    }
}
