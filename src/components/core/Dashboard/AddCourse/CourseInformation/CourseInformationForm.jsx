import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { HiOutlineCurrencyRupee } from "react-icons/hi"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"
import IconBtn from "../../../../common/IconBtn"
import Upload from "../Upload"
import ChipInput from "./ChipInput"
import RequirementsField from "./RequirementField"

export default function CourseInformationForm() {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm()

  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)

  const [loading, setLoading] = useState(false)
  const [courseCategories, setCourseCategories] = useState([])

  // Load categories and, in edit mode, prefill
  useEffect(() => {
    const init = async () => {
      setLoading(true)
      try {
        const cats = await fetchCourseCategories()
        if (cats && cats.length) setCourseCategories(cats)

        if (editCourse && course) {
          setValue("courseTitle", course.courseName)
          setValue("courseShortDesc", course.courseDescription)
          setValue("coursePrice", course.price)
          setValue("courseTags", course.tag)
          setValue("courseBenefits", course.whatYouWillLearn)
          setValue("courseCategory", course.category._id)
          setValue("courseRequirements", course.instructions)
          setValue("courseImage", course.thumbnail)
        }
      } catch (e) {
        console.error("Error fetching categories:", e)
        toast.error("Failed to load categories.")
      } finally {
        setLoading(false)
      }
    }
    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Determine if any field actually changed in edit mode
  const isFormUpdated = () => {
    const vals = getValues()
    return (
      vals.courseTitle !== course.courseName ||
      vals.courseShortDesc !== course.courseDescription ||
      vals.coursePrice !== course.price ||
      vals.courseTags.toString() !== course.tag.toString() ||
      vals.courseBenefits !== course.whatYouWillLearn ||
      vals.courseCategory !== course.category._id ||
      vals.courseRequirements.toString() !== course.instructions.toString() ||
      vals.courseImage !== course.thumbnail
    )
  }

  const onSubmit = async (data) => {
    // VIEW MODE: shouldn't happen, but guard
    if (!data) return

    const formData = new FormData()

    // EDIT MODE
    if (editCourse) {
      if (!isFormUpdated()) {
        toast.error("No changes made to the form")
        return
      }

      const vals = getValues()
      formData.append("courseId", course._id)
      if (vals.courseTitle !== course.courseName)
        formData.append("courseName", vals.courseTitle)
      if (vals.courseShortDesc !== course.courseDescription)
        formData.append("courseDescription", vals.courseShortDesc)
      if (vals.coursePrice !== course.price)
        formData.append("price", vals.coursePrice)
      if (vals.courseTags.toString() !== course.tag.toString())
        formData.append("tag", JSON.stringify(vals.courseTags))
      if (vals.courseBenefits !== course.whatYouWillLearn)
        formData.append("whatYouWillLearn", vals.courseBenefits)
      if (vals.courseCategory !== course.category._id)
        formData.append("category", vals.courseCategory)
      if (
        vals.courseRequirements.toString() !==
        course.instructions.toString()
      )
        formData.append(
          "instructions",
          JSON.stringify(vals.courseRequirements)
        )
      if (vals.courseImage !== course.thumbnail)
        formData.append("thumbnailImage", vals.courseImage)

      setLoading(true)
      try {
        const result = await editCourseDetails(formData, token)
        dispatch(setCourse(result))
        dispatch(setStep(2))
        toast.success("Course updated successfully")
      } catch (error) {
        console.error("EDIT COURSE ERROR", error)
        toast.error(
          error.response?.data?.message ||
            "Failed to update course. Please try again."
        )
      } finally {
        setLoading(false)
      }
      return
    }

    // ADD MODE
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("category", data.courseCategory)
    formData.append("status", COURSE_STATUS.DRAFT)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)

    setLoading(true)
    try {
      const newCourse = await addCourseDetails(formData, token)
      dispatch(setCourse(newCourse))
      dispatch(setStep(2))
      toast.success("Course created successfully")
    } catch (error) {
      console.error("ADD COURSE ERROR", error)
      toast.error(
        error.response?.data?.message ||
          "Failed to create course. Please try again."
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-8 rounded-md border border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Title */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="courseTitle" className="text-sm text-richblack-5">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <p className="text-xs text-pink-200">Course title is required</p>
        )}
      </div>

      {/* Short Description */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="courseShortDesc" className="text-sm text-richblack-5">
          Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style min-h-[130px] w-full resize-none"
        />
        {errors.courseShortDesc && (
          <p className="text-xs text-pink-200">
            Course description is required
          </p>
        )}
      </div>

      {/* Price */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="coursePrice" className="text-sm text-richblack-5">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            id="coursePrice"
            placeholder="Enter Course Price"
            type="number"
            step="0.01"
            {...register("coursePrice", { required: true, min: 0 })}
            className="form-style w-full pl-12"
          />
          <HiOutlineCurrencyRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <p className="text-xs text-pink-200">Price is required</p>
        )}
      </div>

      {/* Category */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="courseCategory" className="text-sm text-richblack-5">
          Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          id="courseCategory"
          {...register("courseCategory", { required: true })}
          className="form-style w-full"
        >
          <option value="">Select category</option>
          {courseCategories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.courseCategory && (
          <p className="text-xs text-pink-200">Category is required</p>
        )}
      </div>

      {/* Tags */}
      <ChipInput
        label="Tags"
        name="courseTags"
        placeholder="Add tags and press enter"
        register={register}
        setValue={setValue}
        getValues={getValues}
        errors={errors}
      />

      {/* Thumbnail */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        video={false}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits */}
      <div className="flex flex-col space-y-2">
        <label htmlFor="courseBenefits" className="text-sm text-richblack-5">
          What You Will Learn <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits"
          {...register("courseBenefits", { required: true })}
          className="form-style min-h-[130px] w-full resize-none"
        />
        {errors.courseBenefits && (
          <p className="text-xs text-pink-200">Benefits are required</p>
        )}
      </div>

      {/* Requirements */}
      <RequirementsField
        name="courseRequirements"
        label="Requirements / Instructions"
        register={register}
        setValue={setValue}
        getValues={getValues}
        errors={errors}
      />

      {/* Next / Save */}
      <div className="flex justify-end gap-2">
        {editCourse && (
          <button
            type="button"
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className="rounded-md bg-richblack-300 px-4 py-2 font-semibold text-richblack-900"
          >
            Continue Without Saving
          </button>
        )}
        <IconBtn disabled={loading} text={editCourse ? "Save Changes" : "Next"}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  )
}
