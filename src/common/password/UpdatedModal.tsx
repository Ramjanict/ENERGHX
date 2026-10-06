import { useChangePasswordMutation } from "@/store/auth/authApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { FC, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { IoClose } from "react-icons/io5";
import { z } from "zod";

// Schema for change password
const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(4, { message: "Password must be at least 4 characters long" }),
    newPassword: z.string(),
  })
  .required();

type ChangePasswordForm = z.infer<typeof changePasswordSchema>;

interface ModalProps {
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdatedModal: FC<ModalProps> = ({ setShowModal }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [changePassword] = useChangePasswordMutation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsLoading(true);
    try {
      await changePassword(data);
      setShowModal(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const modalRef = useRef<HTMLDivElement>(null);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === modalRef.current) {
      setShowModal(false);
    }
  };

  const inputClass = {
    input: "w-full  border border-primary-gray p-2 ",
    label: "text-primary-gray block mb-1",
  };
  return (
    <div
      ref={modalRef}
      onClick={handleOverlayClick}
      className="fixed inset-0 bg-opacity-50 backdrop-blur-sm transition-opacity min-h-screen flex items-center justify-center z-20"
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl shadow-md p-8 w-full max-w-md space-y-6"
      >
        <div className="w-full flex justify-between items-center">
          <h2 className="text-xl font-bold text-center text-gray-800">
            Update Password
          </h2>
          <span
            onClick={() => setShowModal(false)}
            className="text-3xl text-gray-800 cursor-pointer"
          >
            <IoClose />
          </span>
        </div>

        {/* Password */}
        <div className="relative">
          <label className={`${inputClass.label}`}>New Password</label>
          <input
            type={showPassword ? "text" : "password"}
            {...register("oldPassword")}
            className={`${inputClass.input} ${
              errors.oldPassword ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Enter new password"
          />
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-3 top-10 text-gray-500 cursor-pointer"
          >
            {showPassword ? <FiEyeOff /> : <FiEye />}
          </button>
          {errors.oldPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.oldPassword.message}
            </p>
          )}
        </div>

        {/* Confirm Password */}
        <div className=" relative">
          <label className={`${inputClass.label}`}>Confirm Password</label>
          <input
            type={showConfirmPassword ? "text" : "password"}
            {...register("newPassword")}
            className={`${inputClass.input} ${
              errors.newPassword ? "border-red-500" : "border-gray-300"
            }`}
            placeholder="Re-enter password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-3 top-10 text-gray-500 cursor-pointer"
          >
            {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
          </button>
          {errors.newPassword && (
            <p className="text-red-500 text-sm mt-1">
              {errors.newPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className=" mt-2 w-full bg-green-500 text-white font-semibold p-2 rounded-md hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? "Processing..." : "Update Password"}
        </button>
      </form>
    </div>
  );
};

export default UpdatedModal;
