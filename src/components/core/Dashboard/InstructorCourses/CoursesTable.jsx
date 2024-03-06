import { useDispatch, useSelector } from "react-redux";
import { setCourse, setEditCourse } from "../../../../slices/courseSlice";
import { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { FiEdit2 } from "react-icons/fi";
import { HiClock } from "react-icons/hi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../../../services/formatDate";
import {
  deleteCourse,
  fetchInstructorCourses,
} from "../../../../services/operations/courseDetailsAPI";
import { COURSE_STATUS } from "../../../../utils/constants";
import ConfirmationModal from "../../../common/ConfirmationModal";

const CourseTable = ({ courses, setCourses }) => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const navigate = useNavigate();

  const handleCourseDelete = async (courseId) => {
    setLoading(true);
    await deleteCourse({ courseId: courseId }, token);
    const result = await fetchInstructorCourses(token);
    if (result) {
      setCourses(result);
    }
    setConfirmationModal(null);
    setLoading(false);
  };

  return (
    <div>
      <table className="w-full rounded-md  border-[2px] border-richblack-400 bg-richblack-800 table-auto">
        <thead>
          <tr className="flex gap-x-10 rounded-xl border-b border-b-richblack-800 px-6 py-2">
            <th className="flex-1 text-left text-sm font-medium uppercase text-richblack-100">
              Courses
            </th>
            <th className="text-left text-sm font-medium uppercase text-richblack-100">
              Duration
            </th>
            <th className="text-left text-sm font-medium uppercase text-richblack-100">
              Price
            </th>
            <th className="text-left text-sm font-medium uppercase text-richblack-100">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.length === 0 ? (
            <tr>
              <td className="py-10 text-center text-2xl font-medium text-richblack-100">
                No courses found
              </td>
            </tr>
          ) : (
            courses.map((course) => (
              <tr
                key={course._id}
                className="flex gap-x-10 border-b border-richblack-800 px-6 py-8 bg-richblack-700 "
              >
                <td className="flex flex-1 gap-x-4">
                  <img
                    onClick={() => navigate(`/courses/${course._id}`)}
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="max-h-[150px] max-w-[200px] h-auto w-auto rounded-lg object-cover cursor-pointer"
                  />
                  <div className="flex flex-col justify-between">
                    <p className="text-lg font-semibold text-richblack-500">
                      {course.courseName}
                    </p>
                    <p className="text-sm text-richblack-300">
                      {course.courseDescription
                        .split(" ")
                        .slice(0, 10)
                        .join(" ")}
                      {course.courseDescription.split(" ").length > 10
                        ? "..."
                        : ""}
                    </p>
                    <p className="hidden lg:block text-sm text-richblack-300">
                      {course.courseDescription
                        .split(" ")
                        .slice(0, 20)
                        .join(" ")}
                      {course.courseDescription.split(" ").length > 20
                        ? "..."
                        : ""}
                    </p>

                    <p className="text-xs text-richblack-500">
                      Created at - {formatDate(course.createdAt)}
                    </p>
                    {course.status === COURSE_STATUS.DRAFT ? (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-pink-100">
                        <HiClock size={14} />
                        Drafted
                      </p>
                    ) : (
                      <p className="flex w-fit flex-row items-center gap-2 rounded-full bg-richblack-700 px-2 py-[2px] text-[12px] font-medium text-yellow-100">
                        <span className="flex h-3 w-3 items-center justify-center rounded-full bg-yellow-100 text-richblack-700">
                          <FaCheck size={8} />
                        </span>
                        Published
                      </p>
                    )}
                  </div>
                </td>
                <td className="text-sm font-medium text-richblack-100">
                  {course.totalDuration}
                </td>
                <td className="text-sm font-medium text-richblack-100">
                  ₹{course.price}
                </td>
                <td className="text-sm font-medium text-richblack-100 ">
                  <button
                    disabled={loading}
                    onClick={() => {
                      navigate(`/dashboard/edit-course/${course._id}`);
                    }}
                    title="Edit"
                    className="px-2 transition-all duration-200 hover:scale-110 hover:text-caribbeangreen-300"
                  >
                    <FiEdit2 size={20} />
                  </button>
                  <button
                    disabled={loading}
                    onClick={() => {
                      setConfirmationModal({
                        text1: "Do you want to delete this course?",
                        text2:
                          "All the data related to this course will be deleted",
                        btn1Text: !loading ? "Delete" : "Loading...",
                        btn2Text: "Cancel",
                        btn1Handler: !loading
                          ? () => handleCourseDelete(course._id)
                          : () => {},
                        btn2Handler: !loading
                          ? () => setConfirmationModal(null)
                          : () => {},
                      });
                    }}
                    title="Delete"
                    className="px-1 transition-all duration-200 hover:scale-110 hover:text-[#ff0000]"
                  >
                    <RiDeleteBin6Line size={20} />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

export default CourseTable;
