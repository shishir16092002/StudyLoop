import React, { useEffect, useState } from "react";
import ReactStars from "react-rating-stars-component";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css";
import { FaStar } from "react-icons/fa";
import { Autoplay, FreeMode, Pagination } from "swiper";
import { apiConnector } from "../../services/apiconnector";
import { ratingsEndpoints } from "../../services/apis";

function ReviewSlider() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );
        if (data?.success) setReviews(data.data);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      }
    })();
  }, []);


  const avatarURL = (review) => {
    if (review?.user?.image) return review.user.image;

    const fullName = `${review?.user?.firstName ?? ""} ${
      review?.user?.lastName ?? ""
    }`.trim();

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(
      fullName
    )}&background=random&color=ffffff&size=128`;
  };

  return (
    <div className="text-white w-full flex justify-center">
      <div className="my-12 w-full max-w-[1400px] px-4">
        <Swiper
          breakpoints={{
            320: { slidesPerView: 1.1 },
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
            1280: { slidesPerView: 4 },
          }}
          spaceBetween={30}
          loop
          freeMode
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          modules={[FreeMode, Pagination, Autoplay]}
        >
          {reviews.map((review, i) => (
            <SwiperSlide key={i}>
              <div className="flex flex-col justify-between gap-4 rounded-lg bg-richblack-800 p-5 shadow-md h-auto max-h-[320px]">
                {/* avatar + name */}
                <div className="flex items-center gap-4">
                  <img
                    src={avatarURL(review)}
                    alt="user avatar"
                    className="h-12 w-12 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="font-bold text-richblack-5">
                      {review?.user?.firstName} {review?.user?.lastName}
                    </h3>
                    <p className="text-xs text-richblack-300">
                      {review?.course?.courseName}
                    </p>
                  </div>
                </div>

                {/* review text */}
                <div className="overflow-y-auto text-sm text-richblack-25 leading-snug max-h-[140px] pr-2 scrollbar-thin scrollbar-thumb-richblack-600 scrollbar-track-richblack-700">
                  {review?.review}
                </div>

                {/* rating */}
                <div className="flex items-center gap-2">
                  <span className="text-yellow-100 font-semibold">
                    {review.rating.toFixed(1)}
                  </span>
                  <ReactStars
                    count={5}
                    value={review.rating}
                    size={20}
                    edit={false}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default ReviewSlider;
