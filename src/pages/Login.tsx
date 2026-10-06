import CommonButton from "@/common/button/CommonButton";
import ButtonWithLoading from "@/common/loading/ButtonWithLoading";
import { getDashboardPath } from "@/help/getDashboardPath";
import { setUser } from "@/store/auth/auth.slice";
import { useLoginMutation } from "@/store/auth/authApi";
import {
  ConsumerLoginResponse,
  ServerDeveloperLoginResponse,
} from "@/store/auth/types/loginUser";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";

export const inputClass = {
  input: "w-full border border-gray-200 p-2.5 rounded-xl outline-none ",
  label: "text-[#112518] text-sm font-medium block mb-1",
  error: "text-red-500 text-sm mt-1",
};
// Zod schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const [login, { isLoading }] = useLoginMutation();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const result = await login(data).unwrap();
      const serverUser = result as ServerDeveloperLoginResponse | null;
      const consumerUser = result as ConsumerLoginResponse | null;
      const serverToken = serverUser?.data.token;
      const consumerToken = consumerUser?.data.token;

      dispatch(
        setUser({
          user: serverUser || consumerUser,
          token: serverToken || consumerToken,
        }),
      );
      navigate(getDashboardPath(result));
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="flex w-full h-[calc(100vh-76px)]">
      <div className="hidden md:flex md:w-1/2 bg-primary text-white relative overflow-hidden">
        <div className="absolute top-[10%] left-[50%] transform -translate-x-1/2 w-24 h-24 rounded-full bg-green-700"></div>
        <div className="absolute top-[25%] right-[20%] transform rotate-45 w-16 h-16 bg-green-700"></div>
        <div className="absolute top-[45%] right-[15%] transform w-0 h-0 border-l-[50px] border-l-transparent border-t-[80px] border-t-green-700 border-r-[50px] border-r-transparent"></div>
        <div className="absolute bottom-[15%] left-[15%] transform w-32 h-32 rounded-full bg-green-700"></div>
        <div className="absolute bottom-[5%] right-[10%] transform rotate-45 w-40 h-40 bg-green-700"></div>

        <div className="z-10 flex flex-col justify-center px-12 mx-auto text-center">
          <h1 className="mb-4 text-4xl font-bold">Welcome Back!</h1>
          <p className="text-lg">
            To keep connected with us please login
            <br />
            with your personal info
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-8 bg-[#f7fcff]">
        <div className="w-full max-w-md">
          <h2 className="text-4xl font-bold mb-10 text-center text-primary">
            LogIn
          </h2>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <label htmlFor="email" className={inputClass.label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                placeholder="Enter your email"
                {...register("email")}
                className={inputClass.input}
              />
              {errors.email && (
                <p className={inputClass.error}>{errors.email.message}</p>
              )}
            </div>

            <div className="relative">
              <label htmlFor="password" className={inputClass.label}>
                Password
              </label>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className={`${inputClass.input} pr-10`}
              />
              <button
                type="button"
                className="absolute right-3 top-[40px] text-primary-gray cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
              {errors.password && (
                <p className={inputClass.error}>{errors.password.message}</p>
              )}
            </div>

            <CommonButton
              type="submit"
              size="lg"
              disabled={isLoading}
              className="w-full! "
            >
              {isLoading ? (
                <ButtonWithLoading title="Logging in..." />
              ) : (
                "Login"
              )}
            </CommonButton>
          </form>
          <p className="text-center text-sm text-primary-gray mt-4">
            Don&apos;t have an account?{" "}
            <Link to="/" className="text-primary font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
