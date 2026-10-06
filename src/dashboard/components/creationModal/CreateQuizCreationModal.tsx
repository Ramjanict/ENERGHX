import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AdminCommonHeader from "@/dashboard/Common/AdminCommonHeader";
import { defaultQuestion, QuizSchemaType } from "@/dashboard/pages/Quiz";
import {
  useCreateQuizMutation,
  useUpdateQuizMutation,
} from "@/store/LMS/quiz/quizApi";
import { Controller, useFieldArray, UseFormReturn } from "react-hook-form";
import { RiCloseLargeLine } from "react-icons/ri";

interface QuizCreationModalProps {
  form: UseFormReturn<QuizSchemaType>;
  selectedQuiz: QuizSchemaType | null;
  quizId: string;
  onClose: () => void;
  onSuccess: () => void;
}

const QuizCreationModal = ({
  form,
  selectedQuiz,
  quizId,
  onClose,
  onSuccess,
}: QuizCreationModalProps) => {
  const [createQuiz, { isLoading: isCreating }] = useCreateQuizMutation();
  const [UpdateQuiz, { isLoading: isUpdating }] = useUpdateQuizMutation();

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = form;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "quizzesData",
  });

  const isLoading = isCreating || isUpdating;

  const onSubmit = async (data: QuizSchemaType) => {
    try {
      if (quizId) {
        const quizToUpdate = {
          question: data.quizzesData[0].question,
          options: data.quizzesData[0].options,
          correctAnswer: data.quizzesData[0].correctAnswer + 1,
        };
        await UpdateQuiz({ quizId, quiz: quizToUpdate }).unwrap();
      } else {
        const quizToCreate = {
          ...data,
          quizzesData: data.quizzesData.map((quiz) => ({
            ...quiz,
            correctAnswer: quiz.correctAnswer + 1,
          })),
        };
        await createQuiz(quizToCreate).unwrap();
      }
      onSuccess();
    } catch (error) {
      console.error("Failed to submit quiz:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity min-h-screen flex items-center justify-center">
      <div className="w-full flex flex-col justify-center items-center gap-10 h-full overflow-hidden">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 bg-white w-[90%] md:w-[60%] lg:w-[50%] xl:w-[40%] shadow-[0px_0px_1px_2px_rgba(0,0,0,.04)] rounded-xl p-8 overflow-y-scroll"
        >
          <div className="w-full flex justify-between items-center">
            <AdminCommonHeader className="!pb-0">
              {selectedQuiz ? "Update Quiz" : "Create Quiz"}
            </AdminCommonHeader>
            <div
              onClick={onClose}
              className="text-xl cursor-pointer hover:text-red-500"
            >
              <RiCloseLargeLine />
            </div>
          </div>

          {fields.map((field, index) => (
            <div key={field.id} className="pt-6">
              <label className="font-semibold">Question {index + 1}</label>
              <input
                type="text"
                {...register(`quizzesData.${index}.question`)}
                placeholder="Enter the question"
                className="w-full border p-2 rounded outline-none"
              />
              {errors.quizzesData?.[index]?.question && (
                <p className="text-red-600 text-sm">
                  {errors.quizzesData[index].question.message}
                </p>
              )}
              <div className="grid grid-cols-2 gap-4">
                {["A", "B", "C", "D"].map((label, i) => (
                  <div key={i}>
                    <label>Option {label}</label>
                    <input
                      type="text"
                      {...register(`quizzesData.${index}.options.${i}`)}
                      placeholder={`Option ${label}`}
                      className="w-full border p-2 rounded outline-none"
                    />
                    {errors.quizzesData?.[index]?.options?.[i] && (
                      <p className="text-red-600 text-xs">
                        {errors.quizzesData[index].options[i].message}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <label>Correct Answer</label>
              <Controller
                control={control}
                name={`quizzesData.${index}.correctAnswer`}
                render={({ field }) => (
                  <Select
                    onValueChange={(val) => field.onChange(Number(val))}
                    value={String(field.value)}
                  >
                    <SelectTrigger className="w-full border p-2 rounded bg-white outline-none">
                      <SelectValue placeholder="Select correct option" />
                    </SelectTrigger>
                    <SelectContent className="bg-white">
                      <SelectItem value="0">Option A</SelectItem>
                      <SelectItem value="1">Option B</SelectItem>
                      <SelectItem value="2">Option C</SelectItem>
                      <SelectItem value="3">Option D</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.quizzesData?.[index]?.correctAnswer && (
                <p className="text-red-600 text-sm">
                  {errors.quizzesData[index].correctAnswer.message}
                </p>
              )}
            </div>
          ))}

          <div className="flex gap-4 pt-6">
            <button
              type="button"
              onClick={() => append(defaultQuestion)}
              className="bg-blue-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              Add Question
            </button>
            <button
              type="button"
              onClick={() => fields.length > 1 && remove(fields.length - 1)}
              className="bg-red-600 text-white px-4 py-2 rounded disabled:opacity-50 cursor-pointer"
              disabled={fields.length === 1}
            >
              Remove Question
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-green-600 text-white px-6 py-2 rounded cursor-pointer disabled:bg-green-500 disabled:cursor-not-allowed"
            >
              {isLoading
                ? "Processing..."
                : selectedQuiz
                  ? "Update Quiz"
                  : "Create Quiz"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuizCreationModal;
