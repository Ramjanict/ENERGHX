// CurrencyForm.tsx
import AdminCommonButton from "@/dashboard/Common/AdminCommonButton";
import AdminCommonHeader from "@/dashboard/Common/AdminCommonHeader";
import {
  useAddCountryMutation,
  useGetAllCountriesQuery,
} from "@/store/LMS/user/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import CountryCard from "./CountryCard";

const countrySchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be 100 characters or less")
    .trim(),
  code: z.preprocess(
    (val) => (typeof val === "string" ? val.toUpperCase().trim() : val),
    z
      .string()
      .length(3, "Code must be exactly 3 letters")
      .regex(/^[A-Z]{3}$/, "Code must contain only letters (A–Z)"),
  ),
});

type CurrencyFormValues = z.infer<typeof countrySchema>;

export interface CurrencyPayload {
  name: string;
  code: string;
}

const AddCountry = () => {
  const [addCountry, { isLoading }] = useAddCountryMutation();
  const { data } = useGetAllCountriesQuery();

  const allCountries = data?.data ?? [];

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CurrencyFormValues>({
    resolver: zodResolver(countrySchema),
  });

  const onSubmit = async (values: CurrencyFormValues) => {
    const payload: CurrencyPayload = {
      name: values.name.trim(),
      code: values.code.toUpperCase().trim(),
    };

    await addCountry(payload);

    try {
    } catch (err: any) {
      console.error("Submit error:", err);
    } finally {
    }
  };

  const inputClass = {
    input: "w-full border border-primary-gray p-2 outline-none",
    label: "text-primary-gray block mb-1",
    error: "text-red-500 text-sm mt-1",
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className=" flex flex-col gap-4 max-w-xl "
      >
        <AdminCommonHeader className="!pb-0">Add Country</AdminCommonHeader>

        <div>
          <span className={inputClass.label}>Name</span>
          <input
            type="text"
            {...register("name")}
            placeholder="Country or region name (e.g. Nigeria)"
            className={`${inputClass.input}  ${
              errors.name ? `${inputClass.error}` : "border-gray-300"
            }`}
            disabled={isLoading}
            aria-invalid={!!errors.name}
          />
          {errors.name && (
            <p className={inputClass.error}>{errors.name.message}</p>
          )}
        </div>

        <div>
          <span className={inputClass.label}>Country code</span>
          <input
            type="text"
            {...register("code")}
            placeholder="3-letter ISO code (e.g. NGN)"
            maxLength={3}
            className={`${inputClass.input} uppercase ${
              errors.code ? "border-red-500" : "border-gray-300"
            }`}
            disabled={isLoading}
            aria-invalid={!!errors.code}
          />
          {errors.code && (
            <p className={inputClass.error}>{errors.code.message}</p>
          )}
        </div>

        <AdminCommonButton
          type="submit"
          disabled={isLoading}
          className=" !w-fit"
        >
          {isLoading ? "Saving..." : "Add Country"}
        </AdminCommonButton>
      </form>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pt-6">
        {allCountries?.map((country) => (
          <CountryCard
            key={country.id}
            name={country.name}
            code={country.code}
          />
        ))}
      </div>
    </>
  );
};

export default AddCountry;
