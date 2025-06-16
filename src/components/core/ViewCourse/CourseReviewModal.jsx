// src/components/Settings/CourseReviewModal.jsx
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { RxCross2 } from "react-icons/rx";
import ReactStars from "react-rating-stars-component";
import { useSelector } from "react-redux";

import { createRating } from "../../../services/operations/courseDetailsAPI";
import IconBtn from "../../common/IconBtn";

export default function CourseReviewModal({ setReviewModal }) {
  const { user }             = useSelector((state) => state.profile);
  const { token }            = useSelector((state) => state.auth);
  const { courseEntireData } = useSelector((state) => state.viewCourse);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  /* initialise form fields once */
  useEffect(() => {
    setValue("courseExperience", "");
    setValue("courseRating", 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const ratingChanged = (newRating) => setValue("courseRating", newRating);

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating:   data.courseRating,
        review:   data.courseExperience,
      },
      token
    );
    setReviewModal(false);
  };

  /* fallback avatar via UI-Avatars */
  const fullName       = `${user?.firstName ?? "User"} ${user?.lastName ?? ""}`.trim();
  const fallbackAvatar =
    `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}` +
    `&background=random&color=ffffff&size=96`;

  return (
    <div className="fixed inset-0 z-[1000] grid h-screen w-screen place-items-center bg-white/10 backdrop-blur-sm">
      <div 
        className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Modal Header ───────────────────────────────────── */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">Add Review</p>
          <button onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        {/* ── Modal Body ─────────────────────────────────────── */}
        <div className="p-6">
          {/* user avatar + name */}
          <div className="flex items-center gap-x-4">
            <img
              src={user?.image || fallbackAvatar}
              alt={`${fullName} avatar`}
              className="aspect-square w-[50px] rounded-full object-cover"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = fallbackAvatar;
              }}
            />
            <div>
              <p className="font-semibold text-richblack-5">{fullName}</p>
              <p className="text-sm text-richblack-5">Posting publicly</p>
            </div>
          </div>

          {/* form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={24}
              activeColor="#ffd700"
            />

            {/* experience textarea */}
            <div className="mt-4 w-11/12 flex flex-col space-y-2">
              <label
                htmlFor="courseExperience"
                className="text-sm text-richblack-5"
              >
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Share your thoughts about the course"
                {...register("courseExperience", { required: true })}
                className="w-full min-h-[130px] resize-y px-3 py-2 bg-richblack-700 border border-richblack-600 rounded-md text-richblack-5 placeholder-richblack-400 focus:outline-none focus:ring-2 focus:ring-yellow-50 focus:border-transparent transition-colors duration-200"
              />
              {errors.courseExperience && (
                <span className="ml-2 text-xs text-pink-200">
                  Please add your experience
                </span>
              )}
            </div>

            {/* action buttons */}
            <div className="mt-6 w-11/12 flex justify-end gap-x-3">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="rounded-md bg-richblack-300 py-2 px-5 font-semibold text-richblack-900 hover:bg-richblack-200 transition-colors duration-200"
              >
                Cancel
              </button>

              <IconBtn text="Save" type="submit" />
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
