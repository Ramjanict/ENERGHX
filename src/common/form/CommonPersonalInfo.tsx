import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Control,
  Controller,
  FieldErrors,
  UseFormRegister,
  UseFormWatch,
} from "react-hook-form";
import FormSubheader from "../header/FormSubheader";

import {
  useGetAllCountriesQuery,
  useLazyGetAllStatesQuery,
} from "@/store/LMS/user/userApi";
import { TbasicConsumer } from "../password/ValidationSchema";

interface CommonPersonalInfoProps {
  register: UseFormRegister<TbasicConsumer>;
  errors: FieldErrors<TbasicConsumer>;
  control: Control<TbasicConsumer>;
  watch: UseFormWatch<TbasicConsumer>;
}

const CommonPersonalInfo: React.FC<CommonPersonalInfoProps> = ({
  register,
  errors,
  control,
  watch,
}) => {
  const [getAllStates, { data: states }] = useLazyGetAllStatesQuery();
  const allStates = states?.data;

  const { data } = useGetAllCountriesQuery();
  const allCountries = data?.data;
  const selectedCountry = allCountries?.find(
    (c) => c.name === watch("countryName"),
  )?.name;

  return (
    <>
      <div className="py-4">
        <FormSubheader>Personal Information</FormSubheader>
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center ">
            <div>
              <label
                htmlFor="firstName"
                className="text-primary-gray block mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="First Name"
                className=" w-full  border border-primary-gray p-2"
                {...register("firstname")}
              />
              {errors.firstname && (
                <p className="text-red-500 text-xs sm:text-sm ">
                  {errors.firstname.message}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="lastName"
                className="text-primary-gray block mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter Last Name"
                className=" w-full border border-primary-gray p-2"
                {...register("lastname")}
              />
              {errors.lastname && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.lastname.message}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="Other" className="text-primary-gray block mb-1">
                Other Name
              </label>
              <input
                type="text"
                id="Other"
                placeholder="Enter Last Name"
                className=" w-full border border-primary-gray p-2"
                {...register("othername")}
              />
              {errors.othername && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.othername.message}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="text-primary-gray block mb-1"
              >
                Company Name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Company name"
                className=" w-full border border-primary-gray p-2"
                {...register("companyName")}
              />
              {errors.companyName && (
                <p className="text-red-500 text-xs sm:text-sm">
                  {errors.companyName.message}
                </p>
              )}
            </div>
          </div>
        </div>
        <div className="grid  grid-cols-1 sm:grid-cols-3 gap-6 items-center pt-6">
          <div className="">
            <label className="text-primary-gray">Sex</label>
            <div className="flex gap-4 ">
              <label className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  value="MALE"
                  className="hidden peer"
                  {...register("sex")}
                />

                <span className="min-w-5 min-h-5 inline-block border rounded-sm border-primary-gray bg-white peer-checked:bg-primary-green"></span>
                <span className=" text-primary-gray ml-1">Male</span>
              </label>
              <label className="flex items-center cursor-pointer ">
                <input
                  type="radio"
                  value="FEMALE"
                  className="hidden peer "
                  {...register("sex")}
                />

                <span className="min-w-5 min-h-5 inline-block border rounded-sm border-primary-gray bg-white peer-checked:bg-primary-green"></span>
                <span className=" text-primary-gray ml-1">Female</span>
              </label>
            </div>
          </div>
          {errors.sex && (
            <p className="text-red-500 text-xs sm:text-sm">
              {errors.sex.message}
            </p>
          )}

          <div className="">
            <label htmlFor="mail" className="text-primary-gray text-md">
              Mail
            </label>
            <input
              type="email"
              id="mail"
              placeholder="Enter Email"
              className=" w-full  border border-primary-gray p-2 "
              {...register("email")}
            />
            {errors.email && (
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.email.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="">
        <FormSubheader>Street Address</FormSubheader>
        <div className="grid  grid-cols-1 sm:grid-cols-3 gap-6 items-center ">
          <div className="">
            <label
              htmlFor="streetNumber"
              className="text-primary-gray block mb-1"
            >
              Street number
            </label>
            <input
              type="text"
              id="streetNumber"
              placeholder="Enter Number"
              className=" w-full border border-primary-gray p-2"
              {...register("streetNumber")}
            />
            {errors.streetNumber && (
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.streetNumber.message}
              </p>
            )}
          </div>
          <div className="">
            <label htmlFor="street" className="text-primary-gray block mb-1 ">
              Street
            </label>
            <input
              type="text"
              id="street"
              placeholder="Enter Street"
              className=" w-full  border border-primary-gray p-2"
              {...register("streetName")}
            />
            {errors.streetName && (
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.streetName.message}
              </p>
            )}
          </div>

          <div className="">
            <label htmlFor="province" className="text-primary-gray block mb-1">
              Country
            </label>
            <Controller
              name="countryName"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selectedCountry =
                      allCountries &&
                      allCountries.find((c) => c.name === value);
                    if (selectedCountry) {
                      getAllStates(selectedCountry.id);
                    }
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="w-full outline-none  text-primary-gray py-5 rounded-none">
                    <SelectValue placeholder="Choose country" />
                  </SelectTrigger>

                  <SelectContent className="bg-light-green">
                    {allCountries &&
                      allCountries.map((country, index) => (
                        <SelectItem
                          key={index}
                          value={country.name}
                          className="hover:bg-primary-green hover:text-white"
                        >
                          {country.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.countryName && (
              <p className="text-red-500">{errors.countryName.message}</p>
            )}
          </div>
          <div className="">
            <label htmlFor="province" className="text-primary-gray block mb-1">
              Province
            </label>
            <Controller
              name="provinceName"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                  }}
                  value={field.value}
                >
                  <SelectTrigger className="w-full outline-none  text-primary-gray py-5 rounded-none">
                    <SelectValue placeholder="Choose country" />
                  </SelectTrigger>

                  <SelectContent className="bg-light-green">
                    {allStates?.map((country, index) => (
                      <SelectItem
                        key={index}
                        value={country.name}
                        className="hover:bg-primary-green hover:text-white"
                      >
                        {country.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />

            {errors.provinceName && (
              <p className="text-red-500">{errors.provinceName.message}</p>
            )}
          </div>

          <div className="">
            <label htmlFor="city" className="text-primary-gray block mb-1">
              City
            </label>
            <input
              type="text"
              placeholder="Enter City"
              id="city"
              className=" w-full  border border-primary-gray p-2"
              {...register("city")}
            />
            {errors.city && (
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.city.message}
              </p>
            )}
          </div>
          <div className="">
            <label
              htmlFor="postalCode"
              className="text-primary-gray block mb-1"
            >
              Postal Code
            </label>
            <input
              id="postalCode"
              placeholder="Enter Postal Code"
              className=" w-full  border border-primary-gray p-2"
              {...register("postalCode")}
              type={selectedCountry === "Canada" ? "text" : "number"}
              {...register("postalCode", {
                valueAsNumber: selectedCountry !== "Canada",
              })}
            />
            {errors.postalCode && (
              <p className="text-red-500 text-xs sm:text-sm">
                {errors.postalCode.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CommonPersonalInfo;
