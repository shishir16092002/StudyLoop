// src/components/core/HomePage/LearningGrid.jsx
import React from "react";
import HighlightText from "../../../components/core/HomePage/HighlightText";
import CTAButton from "../../../components/core/HomePage/Button";

const LearningGridArray = [
  {
    order: -1,
    heading: "World-Class Learning for",
    highlightText: "Anyone, Anywhere",
    description:
      "StudyLoop partners with more than 275+ leading universities and companies to bring flexible, affordable, job-relevant online learning to individuals and organizations worldwide.",
    BtnText: "Learn More",
    BtnLink: "/",
  },
  {
    order: 1,
    heading: "Curriculum Based on Industry Needs",
    description:
      "Save time and money! The Belajar curriculum is made to be easier to understand and in line with industry needs.",
  },
  {
    order: 2,
    heading: "Our Learning Methods",
    description:
      "StudyLoop partners with more than 275+ leading universities and companies to bring",
  },
  {
    order: 3,
    heading: "Certification",
    description:
      "You will get a certificate that can be used as a certification during job hunting.",
  },
  {
    order: 4,
    heading: `Rating "Auto-grading"`,
    description:
      "You will immediately get feedback during the learning process without having to wait for an answer or response from the mentor.",
  },
  // {
  //   order: 5,
  //   heading: "Ready to Work",
  //   description:
  //     "Connected with over 150+ hiring partners, you will have the opportunity to find a job after graduating from our program.",
  // },
];

const LearningGrid = () => {
  return (
    <div className="mx-auto w-full max-w-[1280px] py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-3">
        {LearningGridArray
          .sort((a, b) => a.order - b.order)
          .map((card, idx) => {
            return (
              <div
                key={idx}
                className={`
                  ${card.order < 0 
                    ? "lg:col-span-2 lg:row-span-2 bg-transparent" 
                    : card.order === 1 || card.order === 2
                    ? "lg:col-span-1 bg-richblack-700"
                    : "lg:col-span-1 bg-richblack-800"
                  }
                  ${card.order === 3 || card.order === 4 || card.order === 5 
                    ? "bg-richblack-700" 
                    : ""
                  }
                  h-[294px] p-8 flex flex-col justify-between
                  ${card.order < 0 ? "" : "border border-richblack-600"}
                `}
              >
                {card.order < 0 ? (
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <h2 className="text-4xl font-semibold text-richblack-5 mb-4">
                        {card.heading}{" "}
                        <HighlightText text={card.highlightText} />
                      </h2>
                      <p className="text-richblack-300 font-medium text-base mb-8">
                        {card.description}
                      </p>
                    </div>
                    <div className="w-fit">
                      <CTAButton active={true} linkto={card.BtnLink}>
                        {card.BtnText}
                      </CTAButton>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col justify-between h-full">
                    <div>
                      <h3 className="text-lg font-semibold text-richblack-5 mb-3">
                        {card.heading}
                      </h3>
                      <p className="text-richblack-300 font-normal text-sm leading-6">
                        {card.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default LearningGrid;
