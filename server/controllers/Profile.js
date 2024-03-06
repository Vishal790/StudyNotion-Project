const Profile = require("../models/Profile");
const CourseProgress = require("../models/CourseProgress");

const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");

const User = require("../models/User");

exports.updateProfile = async (req, res) => {
  try {
    //get data

    const {
      firstName = "",
      lastName = "",
      dateOfBirth = "",
      about = "",
      contactNumber = "",
      gender = "",
    } = req.body;
    //get user Id

    const id = req.user.id;

    //validation
    if (!contactNumber || !gender || !id) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    //find profile
    const userDetails = await User.findById(id);
    const profile = await Profile.findById(userDetails.additionalDetails);
    const profileDetails = await Profile.findById(profile);

    console.log("User ID:", req.user.id);
    console.log("userDetails:", userDetails);
    console.log("profile:", profile);
    console.log("profileDetails:", profileDetails);

    if (!profileDetails) {
      return res.status(404).json({
        success: false,
        error: "Profile not found",
      });
    }

    const userimg = await User.findById(id);
    console.log("User  before updation", userimg);
    const oldimg = userimg.image;

    const imgToUpdate = userimg.image.includes("api.dicebear")
      ? `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`
      : oldimg;

    const user = await User.findByIdAndUpdate(id, {
      firstName,
      lastName,
      image: imgToUpdate,
    });
    await user.save();

    //update profile

    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    await profileDetails.save();

    // Find the updated user details
    const updatedUserDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();

    //return response
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      updatedUserDetails,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

//delete account

exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id;
    console.log(id);
    const user = await User.findById({ _id: id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: user.additionalDetails,
    });

    // Now Delete User
    await User.findByIdAndDelete({ _id: id });
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const id = req.user.id;
    const userDetails = await User.findById(id)
      .populate("additionalDetails")
      .exec();
    console.log(userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//update profile picture
exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log(image);
    const updatedProfile = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.send({
      success: true,
      message: `Image Updated successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Image cannot be updated " + error.message,
    });
  }
};

// exports.getEnrolledCourses = async (req, res) => {
//   try {
//     const userId = req.user.id
//     let userDetails = await User.findOne({
//       _id: userId,
//     })
//       .populate({
//         path: "courses",
//         populate: {
//           path: "courseContent",
//           populate: {
//             path: "subSection",
//           },
//         },
//       })
//       .exec()
//     userDetails = userDetails.toObject()
//     var SubsectionLength = 0
//     for (var i = 0; i < userDetails.courses.length; i++) {
//       let totalDurationInSeconds = 0
//       SubsectionLength = 0
//       for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
//         totalDurationInSeconds += userDetails.courses[i].courseContent[
//           j
//         ].subSection.reduce((acc, curr) => acc + parseInt(curr.timeDuration), 0)
//         userDetails.courses[i].totalDuration = convertSecondsToDuration(
//           totalDurationInSeconds
//         )
//         SubsectionLength +=
//           userDetails.courses[i].courseContent[j].subSection.length
//       }
//       let courseProgressCount = await CourseProgress.findOne({
//         courseID: userDetails.courses[i]._id,
//         userId: userId,
//       })
//       courseProgressCount = courseProgressCount?.completedVideos.length
//       if (SubsectionLength === 0) {
//         userDetails.courses[i].progressPercentage = 100
//       } else {
//         // To make it up to 2 decimal point
//         const multiplier = Math.pow(10, 2)
//         userDetails.courses[i].progressPercentage =
//           Math.round(
//             (courseProgressCount / SubsectionLength) * 100 * multiplier
//           ) / multiplier
//       }
//     }

//     if (!userDetails) {
//       return res.status(400).json({
//         success: false,
//         message: `Could not find user with id: ${userDetails}`,
//       })
//     }
//     return res.status(200).json({
//       success: true,
//       data: userDetails.courses,
//     })
//   } catch (error) {
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     })
//   }
// }
exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    let userDetails = await User.findOne({ _id: userId })
      .populate({
        path: "courses",
        populate: {
          path: "courseContent",
          populate: {
            path: "subSection",
          },
        },
      })
      .exec();

    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userId}`,
      });
    }

    userDetails = userDetails.toObject();

    for (let i = 0; i < userDetails.courses.length; i++) {
      const totalSubsections = userDetails.courses[i].courseContent.reduce(
        (acc, content) => acc + content.subSection.length,
        0
      );
      const completedSubsections =
        (
          await CourseProgress.findOne({
            courseID: userDetails.courses[i]._id,
            userId: userId,
          })
        )?.completedVideos.length || 0;

      const progressPercentage =
        totalSubsections === 0
          ? 100
          : (completedSubsections / totalSubsections) * 100;
      userDetails.courses[i].progressPercentage = parseFloat(
        progressPercentage.toFixed(2)
      ); // Limit to 2 decimal places 
    }

    return res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    console.error("Error in getEnrolledCourses:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.instructorDashboard = async(req, res) => {
  try {
    const courseDetails = await Course.find({instructor:req.user.id});
    const courseData = courseDetails.map((course)=>{
      totalStudentsEnrolled = course.studentsEnrolled.length
      const totalAmountGenerated = totalStudentsEnrolled*course.price;
      //create a new object with additional information
      const courseDataWithStats = {
        _id: course._id,
        courseName:course.courseName,
        courseDescription:course.courseDescription,
        totalStudentsEnrolled,
        totalAmountGenerated

      }
      return courseDataWithStats
    })

    res.status(200).json({
      courses:courseData
    })

  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
