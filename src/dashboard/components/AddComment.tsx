// components/ReviewForm.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useEffect, useState } from "react";
import { IoIosStar, IoIosStarHalf, IoIosStarOutline } from "react-icons/io";

import {
  useAddReviewMutation,
  useUpdateMyReviewMutation,
} from "@/store/LMS/review/reviewApi";
import { z } from "zod";
import AdminCommonButton from "../Common/AdminCommonButton";

export const reviewSchema = z.object({
  rating: z.number().min(1, "Please give a rating"),
  comment: z.string().min(5, "Comment must be at least 5 characters"),
});

export type ReviewSchema = z.infer<typeof reviewSchema>;

const StarRatingInput = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (val: number) => void;
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const renderStar = (index: number) => {
    const effectiveRating = hoverRating || value;

    if (effectiveRating >= index + 1) return <IoIosStar key={index} />;
    else if (effectiveRating >= index + 0.5)
      return <IoIosStarHalf key={index} />;
    else return <IoIosStarOutline key={index} />;
  };

  const handleClick = (index: number) => {
    if (value === index + 1) onChange(0);
    else onChange(index + 1);
  };

  return (
    <div className="flex items-center text-yellow-500 text-2xl mb-2">
      {[0, 1, 2, 3, 4].map((index) => (
        <span
          key={index}
          onClick={() => handleClick(index)}
          onMouseEnter={() => setHoverRating(index + 1)}
          onMouseLeave={() => setHoverRating(0)}
          className="cursor-pointer"
        >
          {renderStar(index)}
        </span>
      ))}
      <span className="text-sm text-gray-500 ml-2">
        ({value > 0 ? `Rated: ${value}` : "No Rating"})
      </span>
    </div>
  );
};

interface AddCommentProps {
  courseId: string;
  reviewId: string | null;
  selectedReview: ReviewSchema | null;
  isSetAddReviewOpen: (data: boolean) => void;
}

const AddComment: React.FC<AddCommentProps> = ({
  courseId,
  selectedReview,
  reviewId,
  isSetAddReviewOpen,
}) => {
  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ReviewSchema>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: selectedReview?.rating || 0,
      comment: selectedReview?.comment || "",
    },
  });

  const [AddReview, { isLoading: isReviewSubmitting }] = useAddReviewMutation();
  const [updateMyReview, { isLoading: isMyReviewUpdate }] =
    useUpdateMyReviewMutation();
  const onSubmit = async (data: ReviewSchema) => {
    const addComment = { ...data, courseId };

    try {
      if (reviewId && selectedReview) {
        await updateMyReview({ reviewId, review: addComment });
      } else if (courseId) {
        await AddReview(addComment);
      }

      reset();
      isSetAddReviewOpen(false);
    } catch (error) {
      console.error("Failed to submit review:", error);
    } finally {
    }
  };

  useEffect(() => {
    reset(selectedReview || { rating: 0, comment: "" });
  }, [selectedReview, reset]);
  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="w-full  p-4 bg-white shadow rounded space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Your Rating</label>
        <Controller
          name="rating"
          control={control}
          render={({ field }) => (
            <StarRatingInput value={field.value} onChange={field.onChange} />
          )}
        />
        {errors.rating && (
          <p className="text-red-500 text-sm mt-1">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Your Comment</label>
        <textarea
          {...register("comment")}
          className="w-full border border-gray-300 px-3 py-2 rounded focus:outline-none focus:border-green-500"
          rows={4}
          placeholder="Write your thoughts..."
        />
        {errors.comment && (
          <p className="text-red-500 text-sm mt-1">{errors.comment.message}</p>
        )}
      </div>

      <AdminCommonButton
        disabled={isReviewSubmitting || isMyReviewUpdate}
        className="!w-fit"
        type="submit"
      >
        {isReviewSubmitting || isMyReviewUpdate
          ? "Processing..."
          : selectedReview
            ? "Update Review"
            : "Submit Review"}
      </AdminCommonButton>
    </form>
  );
};

export default AddComment;
