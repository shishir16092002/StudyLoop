// services/operations/courseDetailsAPI.js

import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { courseEndpoints } from "../apis"

const {
  COURSE_DETAILS_API,
  COURSE_CATEGORIES_API,
  GET_ALL_COURSE_API,
  CREATE_COURSE_API,
  EDIT_COURSE_API,
  CREATE_SECTION_API,
  CREATE_SUBSECTION_API,
  UPDATE_SECTION_API,
  UPDATE_SUBSECTION_API,
  DELETE_SECTION_API,
  DELETE_SUBSECTION_API,
  GET_ALL_INSTRUCTOR_COURSES_API,
  DELETE_COURSE_API,
  GET_FULL_COURSE_DETAILS_AUTHENTICATED,
  CREATE_RATING_API,
  LECTURE_COMPLETION_API,
} = courseEndpoints

// Helper to extract and display server messages
function handleError(err, defaultMsg) {
  const serverMsg = err.response?.data?.message
  const msg = serverMsg || defaultMsg
  toast.error(msg)
  console.error(defaultMsg, err)
}

// Fetch all published courses
export const getAllCourses = async () => {
  const toastId = toast.loading("Loading courses…")
  let result = []
  try {
    const response = await apiConnector("GET", GET_ALL_COURSE_API)
    if (!response?.data?.success) throw new Error("Could Not Fetch Courses")
    result = response.data.data
  } catch (err) {
    handleError(err, "GET_ALL_COURSE_API API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Fetch single course details (public)
export const fetchCourseDetails = async (courseId) => {
  const toastId = toast.loading("Loading course details…")
  let result = null
  try {
    const response = await apiConnector("POST", COURSE_DETAILS_API, { courseId })
    if (!response.data.success) throw new Error(response.data.message)
    result = response.data
  } catch (err) {
    handleError(err, "COURSE_DETAILS_API API ERROR")
    result = err.response?.data || null
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Fetch all categories
export const fetchCourseCategories = async () => {
  const toastId = toast.loading("Loading categories…")
  let result = []
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    if (!response?.data?.success) throw new Error("Could Not Fetch Categories")
    result = response.data.data
  } catch (err) {
    handleError(err, "COURSE_CATEGORIES_API API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Create a new course
export const addCourseDetails = async (data, token) => {
  const toastId = toast.loading("Adding course…")
  let result = null
  try {
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) throw new Error(response.data.message)
    toast.success("Course Details Added Successfully")
    result = response.data.data
  } catch (err) {
    handleError(err, "CREATE_COURSE_API API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Edit course details
export const editCourseDetails = async (data, token) => {
  const toastId = toast.loading("Updating course…")
  let result = null
  try {
    const response = await apiConnector("POST", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) throw new Error(response.data.message)
    toast.success("Course Details Updated Successfully")
    result = response.data.data
  } catch (err) {
    handleError(err, "EDIT_COURSE_API API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Create a section
export const createSection = async (data, token) => {
  const toastId = toast.loading("Creating section…")
  let result = null
  try {
    const response = await apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) throw new Error(response.data.message)
    toast.success("Course Section Created")
    result = response.data.updatedCourse
  } catch (err) {
    handleError(err, "CREATE_SECTION_API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Create a subsection
export const createSubSection = async (data, token) => {
  const toastId = toast.loading("Adding lecture…")
  let result = null
  try {
    const response = await apiConnector("POST", CREATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) throw new Error(response.data.message)
    toast.success("Lecture Added")
    result = response.data.data
  } catch (err) {
    handleError(err, "CREATE_SUBSECTION_API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Update a section
export const updateSection = async (data, token) => {
  const toastId = toast.loading("Updating section…")
  let result = null
  try {
    const response = await apiConnector("POST", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) throw new Error(response.data.message)
    toast.success("Course Section Updated")
    result = response.data.data
  } catch (err) {
    handleError(err, "UPDATE_SECTION_API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Update a subsection
export const updateSubSection = async (data, token) => {
  const toastId = toast.loading("Updating lecture…")
  let result = null
  try {
    const response = await apiConnector("POST", UPDATE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) throw new Error(response.data.message)
    toast.success("Lecture Updated")
    result = response.data.data
  } catch (err) {
    handleError(err, "UPDATE_SUBSECTION_API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Delete a section
export const deleteSection = async (data, token) => {
  const toastId = toast.loading("Deleting section…")
  let result = null
  try {
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) throw new Error(response.data.message)
    toast.success("Course Section Deleted")
    result = response.data.data
  } catch (err) {
    handleError(err, "DELETE_SECTION_API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Delete a subsection
export const deleteSubSection = async (data, token) => {
  const toastId = toast.loading("Deleting lecture…")
  let result = null
  try {
    const response = await apiConnector("POST", DELETE_SUBSECTION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) throw new Error(response.data.message)
    toast.success("Lecture Deleted")
    result = response.data.data
  } catch (err) {
    handleError(err, "DELETE_SUBSECTION_API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Fetch instructor courses
export const fetchInstructorCourses = async (token) => {
  const toastId = toast.loading("Loading your courses…")
  let result = []
  try {
    const response = await apiConnector(
      "GET",
      GET_ALL_INSTRUCTOR_COURSES_API,
      null,
      { Authorization: `Bearer ${token}` }
    )
    if (!response.data.success) throw new Error(response.data.message)
    result = response.data.data
  } catch (err) {
    handleError(err, "GET_ALL_INSTRUCTOR_COURSES_API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Delete a course
export const deleteCourse = async (data, token) => {
  const toastId = toast.loading("Deleting course…")
  try {
    const response = await apiConnector("DELETE", DELETE_COURSE_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) throw new Error(response.data.message)
    toast.success("Course Deleted")
  } catch (err) {
    handleError(err, "DELETE_COURSE_API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
}

// Get full course details (authenticated)
export const getFullDetailsOfCourse = async (courseId, token) => {
  const toastId = toast.loading("Loading full course details…")
  let result = null
  try {
    const response = await apiConnector(
      "POST",
      GET_FULL_COURSE_DETAILS_AUTHENTICATED,
      { courseId },
      { Authorization: `Bearer ${token}` }
    )
    if (!response.data.success) throw new Error(response.data.message)
    result = response.data.data
  } catch (err) {
    handleError(err, "GET_FULL_COURSE_DETAILS_AUTHENTICATED ERROR")
    result = err.response?.data || null
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Mark lecture as complete
export const markLectureAsComplete = async (data, token) => {
  const toastId = toast.loading("Marking lecture complete…")
  let result = false
  try {
    const response = await apiConnector("POST", LECTURE_COMPLETION_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.message) throw new Error(response.data.error)
    toast.success("Lecture Completed")
    result = true
  } catch (err) {
    handleError(err, "LECTURE_COMPLETION_API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return result
}

// Create a rating
export const createRating = async (data, token) => {
  const toastId = toast.loading("Submitting rating…")
  let success = false
  try {
    const response = await apiConnector("POST", CREATE_RATING_API, data, {
      Authorization: `Bearer ${token}`,
    })
    if (!response.data.success) throw new Error(response.data.message)
    toast.success("Rating Created")
    success = true
  } catch (err) {
    handleError(err, "CREATE_RATING_API ERROR")
  } finally {
    toast.dismiss(toastId)
  }
  return success
}
