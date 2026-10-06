import { AllReview } from "@/store/LMS/review/types/reviewsType";
import { Star } from "lucide-react"; // or use IoIosStar if you prefer
import React from "react";

type ReviewCardProps = {
  allReview: AllReview[];
};

const AllReviewCard: React.FC<ReviewCardProps> = ({ allReview }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
      {allReview.map((review) => (
        <div
          key={review.id}
          className="relative max-w-sm rounded-2xl overflow-hidden shadow-md bg-white border hover:shadow-lg transition-shadow duration-300"
        >
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold text-gray-800">
                Course ID: {review.courseId.slice(0, 6)}...
              </h3>
              <div className="flex text-yellow-500">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-yellow-400" />
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-700">{review.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AllReviewCard;
