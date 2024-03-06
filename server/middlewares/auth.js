const jwt = require('jsonwebtoken');
require("dotenv").config();
const User = require("../models/User")



//auth
exports.auth = async (req, res, next) => {
    try {
        //extract token
        const token = req.cookies.token
            || req.body.token
            || req.header("Authorization").replace("Bearer ", "");

        //if token is not present

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Token does not exist"
            })
        }

        //verify token
        try {
            const decode = jwt.verify(token, process.env.JWT_SECRET);
           // console.log(decode);
            req.user = decode
        }
        catch (err) {
            return res.status(401).json({
                success: false,
                message: "token is not valid"
            })
        }

        next();

    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "User cannot be authenticated"
        })
    }
}

// Is Student
exports.isStudent = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Student") {
            return res.status(401).json({
                success: false,
                message: "This is a protected account for Students only"
            })

        }

    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "User cannot be verified"
        })
    }
    next();
}

//Is Instructor

exports.isInstructor = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Instructor") {
            return res.status(401).json({
                success: false,
                message: "This is a protected account for Instructor only"
            })

        }

    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "User cannot be verified"
        })
    }
    next();

}

//Is Admin 
exports.isAdmin = async (req, res, next) => {
    try {
        if (req.user.accountType !== "Admin") {
            return res.status(401).json({
                success: false,
                message: "This is a protected account for Admin only"
            })

        }

    }
    catch (err) {
        return res.status(401).json({
            success: false,
            message: "User cannot be verified"
        })
    }
    next();

}






