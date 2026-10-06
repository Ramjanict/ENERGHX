import QuizAssessmentCard from "@/dashboard/components/QuizAssessmentCard";
import SubmitQuiz from "@/dashboard/components/SubmitQuiz";
import { useGetSingleContentQuery } from "@/store/LMS/content/contentApi";
import {
  AllModule,
  BasicContent,
} from "@/store/LMS/module/types/regularModule";
import { CourseProgress } from "@/store/LMS/progressAndCertificate/types/progressType";
import { useGetQuizResultQuery } from "@/store/LMS/quiz/quizApi";
import CommonHeader from "../header/CommonHeader";
import VideoSkeleton from "../loading/VideoSkeleton";

interface ModuleDisplayProps {
  selectBasicContent: BasicContent | null;
  allModule: AllModule | null;
  selectModulesId: string | null;
  isHandleProgress: boolean;
  courseProgress: CourseProgress;
}

const ModuleDisplay: React.FC<ModuleDisplayProps> = ({
  selectBasicContent,
  selectModulesId,
  isHandleProgress,
  allModule,
  courseProgress,
}) => {
  const { data: singleContentData } = useGetSingleContentQuery(
    selectModulesId as string,
    {
      skip: !selectModulesId,
      refetchOnMountOrArgChange: true,
    },
  );

  const singleContent = singleContentData?.data;

  const { data: mark } = useGetQuizResultQuery();
  return (
    <div className="w-[70%] space-y-6">
      {isHandleProgress ? (
        <VideoSkeleton />
      ) : (
        <>
          {selectBasicContent && (
            <div className="aspect-video w-full rounded-xl overflow-hidden border mb-4 shadow-sm">
              <video
                src={
                  typeof selectBasicContent.video === "string"
                    ? selectBasicContent.video
                    : URL.createObjectURL(selectBasicContent.video)
                }
                controls
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {selectModulesId &&
            courseProgress?.watchedContents?.includes(
              singleContent?.id ?? "",
            ) &&
            singleContent?.contentType && (
              <div className="p-6 rounded-2xl shadow-md bg-white border border-gray-200">
                {/* VIDEO BLOCK */}
                {singleContent.contentType === "VIDEO" &&
                  singleContent.video && (
                    <>
                      <div className="aspect-video w-full rounded-xl overflow-hidden border mb-4 shadow-sm">
                        <video
                          src={singleContent.video}
                          controls
                          autoPlay
                          playsInline
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </>
                  )}

                {/* DESCRIPTION BLOCK */}
                {singleContent.contentType === "DESCRIPTION" &&
                  singleContent.description && (
                    <div className="text-gray-700 text-base leading-relaxed space-y-2">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Description
                      </h3>
                      <p>{singleContent.description}</p>
                    </div>
                  )}

                {/* QUIZ BLOCK */}
                {singleContent.contentType === "QUIZ" &&
                singleContent?.quiz?.quizzes?.length > 0 ? (
                  <div className="text-gray-700 text-base">
                    <div className="mb-4 flex justify-between items-center">
                      <h3 className="text-xl font-bold text-gray-900 mb-1">
                        Quiz Assessment
                      </h3>
                    </div>

                    {mark ? (
                      <QuizAssessmentCard quizResult={mark} />
                    ) : (
                      <SubmitQuiz
                        quizzes={singleContent.quiz.quizzes}
                        contentId={singleContent.quiz.contentId}
                      />
                    )}
                  </div>
                ) : (
                  <p>No quizzes found.</p>
                )}
              </div>
            )}
        </>
      )}

      {!selectModulesId && !selectBasicContent && (
        <div className="p-6 rounded-2xl shadow-md bg-white border border-gray-200">
          <CommonHeader className="!pb-4">{allModule?.title}</CommonHeader>
          <div className="rounded-xl overflow-hidden shadow">
            <img
              src={allModule?.thumbnail}
              alt="Program Thumbnail"
              className="w-full h-64 object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleDisplay;
