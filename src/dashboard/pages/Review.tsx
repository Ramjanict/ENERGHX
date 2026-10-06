import {
  useGetAllReviewQuery,
  useGetSingleReviewQuery,
} from "@/store/LMS/review/reviewApi";
import { useState } from "react";
import AdminCommonButton from "../Common/AdminCommonButton";
import AdminCommonHeader from "../Common/AdminCommonHeader";
import AllCourse from "../components/AllCourse";
import AllReviewCard from "../components/AllReviewCard";
import SingleReviewCard from "../components/SingleReviewCard";

const Review = () => {
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [showAllReview, setShowAllReview] = useState(false);

  const { data: allReviewData, isFetching: isAllReviewFetching } =
    useGetAllReviewQuery(undefined, {
      skip: !showAllReview,
    });
  const allReview = allReviewData?.data ?? [];

  const { data: singleReviewData } = useGetSingleReviewQuery(selectedCourseId, {
    skip: !selectedCourseId,
    refetchOnMountOrArgChange: true,
  });
  const singleReview = singleReviewData?.data ?? [];

  const handleCourseChange = (value: string) => {
    setSelectedCourseId(value);
    setShowAllReview(false);
  };

  const handleClick = () => {
    setSelectedCourseId("");
    setShowAllReview(true);
  };

  return (
    <>
      <AdminCommonHeader>All Review</AdminCommonHeader>

      <div className="flex items-center gap-2">
        <AdminCommonHeader className="!pb-0">
          Show review based on course
        </AdminCommonHeader>
        <AllCourse
          handleCourseChange={handleCourseChange}
          selectedCourseId={selectedCourseId}
        />
      </div>

      {selectedCourseId && !showAllReview ? (
        singleReview.length > 0 ? (
          <div className="py-6">
            <SingleReviewCard singleReview={singleReview} />
          </div>
        ) : (
          <AdminCommonHeader className="!text-sm pt-2">
            This course does not contain any review
          </AdminCommonHeader>
        )
      ) : null}

      {showAllReview && allReview.length > 0 && (
        <div className="py-6">
          <AllReviewCard allReview={allReview} />
        </div>
      )}

      <AdminCommonButton
        disabled={isAllReviewFetching}
        onClick={handleClick}
        className="!w-fit my-6"
      >
        {isAllReviewFetching ? "Processing..." : "Show all reviews"}
      </AdminCommonButton>
    </>
  );
};

export default Review;
