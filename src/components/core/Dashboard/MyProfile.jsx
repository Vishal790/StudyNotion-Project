import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import IconBtn from "../../common/IconBtn";
import Sidebar from "./Sidebar";
import { RiEditBoxLine } from "react-icons/ri";
import { getUserDetails } from "../../../services/operations/profileAPI"



const MyProfile = () => {
  const { user } = useSelector((state) => state.profile);
  const {token} = useSelector((state) => state.auth)
  const navigate = useNavigate();
  const dispatch = useDispatch();


  // useEffect(()=>{
  //  dispatch(getUserDetails(token,navigate))
  // },[])




  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5 flex items-center justify-center">
        My Profile
      </h1>

      {/* section 1 */}

      <div className=" flex flex-col gap-y-3 md:flex-row w-[400px]  sm:w-auto items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex items-center gap-x-4">
          <img
            src={user?.image}
            alt={`profile-${user.firstName} `}
            className="aspect-square w-[78px] rounded-full object-cover"
          />
          <div className="space-y-1">
            <p className="text-lg font-semibold text-richblack-5">
              {user?.firstName + " " + user?.lastName}
            </p>
            <p className="text-sm text-richblack-300">{user?.email}</p>
          </div>
        </div>
        <IconBtn
          text="Edit"
          onclick={() => {
            console.log("Edit button clicked"); // Add this line for debugging
            navigate("/dashboard/settings");
          }}
        >
          <RiEditBoxLine />
        </IconBtn>

      </div>

      {/* section 2 */}

      <div className="my-10 flex flex-col gap-y-10 rounded-md border-[1px] w-[400px]  sm:w-auto border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex w-full items-center justify-between  gap-y-3 flex-col md:flex-row" >
          <p className="text-lg font-semibold text-richblack-5">About</p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <p
          className={`${
            user?.additionalDetails?.about
              ? "text-richblack-5"
              : "text-richblack-400"
          } text-sm font-medium  mx-auto`}
        >
          {user?.additionalDetails?.about ?? "Write Something About Yourself"}
        </p>
      </div>

      {/* section 3 */}
      <div className="my-10 flex flex-col w-[400px]  sm:w-auto gap-y-10 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
        <div className="flex w-full items-center justify-between">
          <p className="text-lg font-semibold text-richblack-5">
            Personal Details
          </p>
          <IconBtn
            text="Edit"
            onclick={() => {
              navigate("/dashboard/settings");
            }}
          >
            <RiEditBoxLine />
          </IconBtn>
        </div>
        <div className="flex flex-col md:flex-row max-w-[500px] justify-between">
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-300">First Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.firstName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-300">Email</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.email}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-300">Gender</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.gender ?? "Add Gender"}
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-y-5">
            <div>
              <p className="mb-2 text-sm text-richblack-300">Last Name</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.lastName}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-300">Phone Number</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.contactNumber ?? "Add Contact Number"}
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-richblack-300">Date Of Birth</p>
              <p className="text-sm font-medium text-richblack-5">
                {user?.additionalDetails?.dateOfBirth ?? "Add Date Of Birth"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
