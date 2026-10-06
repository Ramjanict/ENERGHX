import CommonBorderWrapper from "@/common/button/CommonBorderWrapper";
import { useDeleteMyReviewMutation } from "@/store/LMS/review/reviewApi";
import { MyReview } from "@/store/LMS/review/types/reviewsType";

interface Comment {
  rating: number;
  comment: string;
}

interface ReviewCardProps {
  review: MyReview[];
  handleReview(data: Comment, id: string): void;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review, handleReview }) => {
  const [deleteMyReview, { isLoading, originalArgs }] =
    useDeleteMyReviewMutation();

  const handleDelete = async (reviewId: string) => {
    try {
      await deleteMyReview(reviewId);
    } catch (error) {
      console.error("Failed to delete review:", error);
    } finally {
    }
  };

  return (
    <div className="space-y-4">
      {review.map((r) => {
        const isDeleting = isLoading && originalArgs === r.id;

        return (
          <CommonBorderWrapper key={r.id} className="space-y-3">
            <h3 className="text-lg font-semibold">{r.course.title}</h3>

            <div className="text-yellow-500 text-xl">
              {"★".repeat(r.rating)}
            </div>

            <p className="text-gray-700">{r.comment}</p>

            <div className="flex gap-3 mt-2">
              <button
                onClick={() =>
                  handleReview({ rating: r.rating, comment: r.comment }, r.id)
                }
                className="text-sm px-3 py-1 bg-blue-500 text-white rounded cursor-pointer"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(r.id)}
                disabled={isDeleting}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </CommonBorderWrapper>
        );
      })}
    </div>
  );
};

export default ReviewCard;
