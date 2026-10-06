import { inputClass } from "@/pages/Login";
import { useForgotPasswordMutation } from "@/store/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CommonButton from "../button/CommonButton";
import SectionHeader from "../header/SectionHeader";
import ButtonWithLoading from "../loading/ButtonWithLoading";

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

const ForgotPassword = () => {
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      await forgotPassword(data);
    } catch (error) {
      console.error(error);
    } finally {
    }
  };

  return (
    <div className=" h-[calc(100vh-74px)] flex justify-center items-center bg-gray-50 border-[#E7E9E8]">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md space-y-6"
      >
        <SectionHeader title="Forgot Password" />
        <div className="">
          <label className={inputClass.label}>Email</label>
          <input
            type="email"
            {...register("email")}
            className={`${inputClass.input} transition ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className={inputClass.error}>{errors.email.message}</p>
          )}
        </div>

        <CommonButton type="submit" disabled={isLoading} className="w-full">
          {isLoading ? (
            <ButtonWithLoading title="Sending Email" />
          ) : (
            "Send Email"
          )}
        </CommonButton>
      </form>
    </div>
  );
};

export default ForgotPassword;
