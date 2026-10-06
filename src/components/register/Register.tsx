import CommonButton from "@/common/button/CommonButton";
import CommonSelect from "@/common/button/CommonSelect";
import CommonWrapper from "@/common/CommonWrapper";
import SectionHeader from "@/common/header/SectionHeader";
import ButtonWithLoading from "@/common/loading/ButtonWithLoading";
import { inputClass } from "@/pages/Login";
import { useUserRegisterMutation } from "@/store/auth/authApi";
import {
  useGetAllCountriesQuery,
  useLazyGetAllStatesQuery,
} from "@/store/LMS/user/userApi";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineUpload,
} from "react-icons/ai";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  POSTAL_CODE_RULES,
  SignUpType,
  signupSchema,
} from "./ValidationSchema";

const sexOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
] as const;

const Register = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const { userTypeName } = useSelector((state: RootState) => state.auth);
  const [userRegister, { isLoading }] = useUserRegisterMutation();

  const [getAllStates, { data: states }] = useLazyGetAllStatesQuery();
  const allStates = states?.data;

  const { data } = useGetAllCountriesQuery();
  const allCountries = data?.data;

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<SignUpType>({
    resolver: zodResolver(signupSchema),
  });

  const countryId = watch("countryId");
  const selectedCountryName = allCountries?.find(
    (c) => c.id === countryId,
  )?.name;
  const postalRule = selectedCountryName
    ? POSTAL_CODE_RULES[selectedCountryName]
    : undefined;

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setValue("image", file, { shouldValidate: true });
      const imageURL = URL.createObjectURL(file);
      setImagePreview(imageURL);
    }
  };

  const onSubmit = async (data: SignUpType) => {
    try {
      const formData = new FormData();
      const { image, ...restData } = data;

      const payload = { ...restData, user_type_name: userTypeName };
      formData.append("text", JSON.stringify(payload));

      if (image && image instanceof File) {
        formData.append("file", image);
      }
      await userRegister(formData);
      navigate("/login");
    } catch (error) {
      console.error("Form submission failed:", error);
    }
  };

  const countryOptions =
    allCountries?.map((c) => ({ label: c.name, value: c.id })) ?? [];
  const stateOptions =
    allStates?.map((s) => ({ label: s.name, value: s.id })) ?? [];
  const [showPassword, setShowPassword] = useState(false);
  return (
    <CommonWrapper>
      <div className="w-full space-y-6 my-4">
        <SectionHeader
          title="Personal Information"
          description={`Fill in your details to create an account`}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label htmlFor="firstname" className={inputClass.label}>
                First Name
              </label>
              <input
                {...register("firstname")}
                id="firstname"
                placeholder="First Name"
                className={inputClass.input}
              />
              {errors.firstname && (
                <p className={inputClass.error}>{errors.firstname.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="lastname" className={inputClass.label}>
                Last Name
              </label>
              <input
                {...register("lastname")}
                id="lastname"
                placeholder="Last Name"
                className={inputClass.input}
              />
              {errors.lastname && (
                <p className={inputClass.error}>{errors.lastname.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="othername" className={inputClass.label}>
                Other Name
              </label>
              <input
                {...register("othername")}
                id="othername"
                placeholder="Other Name"
                className={inputClass.input}
              />
              {errors.othername && (
                <p className={inputClass.error}>{errors.othername.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="companyName" className={inputClass.label}>
                Company Name
              </label>
              <input
                type="text"
                {...register("companyName")}
                id="companyName"
                placeholder="Company Name"
                className={inputClass.input}
              />
              {errors.companyName && (
                <p className={inputClass.error}>{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label className={inputClass.label}>Sex</label>
              <Controller
                name="sex"
                control={control}
                render={({ field }) => (
                  <CommonSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    item={sexOptions}
                    placeholder="Choose sex"
                    className="w-full"
                  />
                )}
              />
              {errors.sex && (
                <p className={inputClass.error}>{errors.sex.message}</p>
              )}
            </div>
          </div>

          {/* Credentials */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className={inputClass.label}>
                Email
              </label>
              <input
                {...register("email")}
                id="email"
                type="email"
                placeholder="Enter Email"
                className={inputClass.input}
              />
              {errors.email && (
                <p className={inputClass.error}>{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className={inputClass.label}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  id="password"
                  placeholder="Enter Password"
                  className={`${inputClass.input} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-600 transition-colors duration-150"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible className="text-lg" />
                  ) : (
                    <AiOutlineEye className="text-lg" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className={inputClass.error}>{errors.password.message}</p>
              )}
            </div>
          </div>

          {/* Photo */}
          <div>
            <label className={inputClass.label}>Photo</label>

            <div className="flex items-start gap-4">
              <label
                htmlFor="photo"
                className="flex items-center gap-2 border border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400 transition-colors duration-200 rounded-xl px-4 py-3 cursor-pointer relative"
              >
                <AiOutlineUpload className="text-lg text-gray-500" />
                <span className="text-sm text-gray-600 font-medium">
                  Upload photo
                </span>
                <input
                  type="file"
                  id="photo"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
              </label>

              {imagePreview && (
                <div className="flex items-center gap-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-16 h-16 object-cover rounded-xl border border-gray-200 shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setValue("image", undefined as never, {
                        shouldValidate: true,
                      });
                      setImagePreview(null);
                      const input = document.getElementById(
                        "photo",
                      ) as HTMLInputElement;
                      if (input) input.value = "";
                    }}
                    className="text-xs font-medium cursor-pointer text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 transition-colors duration-200 rounded-lg px-3 py-2"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>
            {errors.image && (
              <p className={inputClass.error}>{errors.image.message}</p>
            )}
          </div>

          {/* Street Address */}
          <div>
            <SectionHeader
              title="Street Address"
              size="md"
              className="font-semibold! mb-1"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label htmlFor="streetNumber" className={inputClass.label}>
                  Street Number
                </label>
                <input
                  type="text"
                  {...register("streetNumber")}
                  id="streetNumber"
                  placeholder="Enter Number"
                  className={inputClass.input}
                />
                {errors.streetNumber && (
                  <p className={inputClass.error}>
                    {errors.streetNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label htmlFor="street" className={inputClass.label}>
                  Street
                </label>
                <input
                  {...register("street")}
                  id="street"
                  placeholder="Street Address"
                  className={inputClass.input}
                />
                {errors.street && (
                  <p className={inputClass.error}>{errors.street.message}</p>
                )}
              </div>

              <div>
                <label className={inputClass.label}>Country</label>
                <Controller
                  name="countryId"
                  control={control}
                  render={({ field }) => (
                    <CommonSelect
                      value={field.value}
                      onValueChange={(value) => {
                        field.onChange(value);
                        setValue("stateId", undefined as never, {
                          shouldValidate: false,
                        });
                        getAllStates(value);
                      }}
                      item={countryOptions}
                      placeholder="Choose country"
                      className="w-full"
                    />
                  )}
                />
                {errors.countryId && (
                  <p className={inputClass.error}>{errors.countryId.message}</p>
                )}
              </div>

              <div>
                <label className={inputClass.label}>Province</label>
                <Controller
                  name="stateId"
                  control={control}
                  render={({ field }) => (
                    <CommonSelect
                      value={field.value}
                      onValueChange={field.onChange}
                      item={stateOptions}
                      placeholder="Choose province"
                      disabled={!countryId}
                      className="w-full"
                    />
                  )}
                />
                {errors.stateId && (
                  <p className={inputClass.error}>{errors.stateId.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="city" className={inputClass.label}>
                  City
                </label>
                <input
                  {...register("city")}
                  id="city"
                  placeholder="City"
                  className={inputClass.input}
                />
                {errors.city && (
                  <p className={inputClass.error}>{errors.city.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="postalCode" className={inputClass.label}>
                  Postal Code
                </label>
                <input
                  {...register("postalCode")}
                  id="postalCode"
                  type="text"
                  inputMode={postalRule?.inputMode ?? "text"}
                  placeholder={
                    postalRule
                      ? postalRule.format("").length
                        ? ""
                        : (postalRule.message.match(/\((.*)\)/)?.[1] ??
                          "Postal Code")
                      : "Postal Code"
                  }
                  onChange={(e) => {
                    const raw = e.target.value;
                    const formatted = postalRule ? postalRule.format(raw) : raw;
                    e.target.value = formatted;
                    register("postalCode").onChange(e);
                  }}
                  className={inputClass.input}
                />
                {errors.postalCode && (
                  <p className={inputClass.error}>
                    {errors.postalCode.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4">
            <CommonButton type="submit" disabled={isLoading}>
              {isLoading ? (
                <ButtonWithLoading title="Processing..." />
              ) : (
                userTypeName
              )}
            </CommonButton>
          </div>
        </form>
      </div>
    </CommonWrapper>
  );
};

export default Register;
