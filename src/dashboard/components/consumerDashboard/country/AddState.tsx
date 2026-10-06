import AdminCommonButton from "@/dashboard/Common/AdminCommonButton";
import AdminCommonHeader from "@/dashboard/Common/AdminCommonHeader";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import CommonSelect from "@/common/button/CommonSelect";
import {
  useAddStateMutation,
  useGetAllCountriesQuery,
} from "@/store/LMS/user/userApi";

const formSchema = z.object({
  countryId: z.string().nonempty("Please select a country"),
  states: z
    .string()
    .nonempty("Please enter at least one state")
    .transform((val) => val.split(",").map((s) => s.trim()))
    .refine(
      (statesArray) => statesArray.length > 0,
      "You must enter at least one state",
    ),
});

type FormData = z.infer<typeof formSchema>;

const AddState = () => {
  const [addState, { isLoading }] = useAddStateMutation();
  const { data } = useGetAllCountriesQuery();

  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = async (data: FormData) => {
    const payload = { names: data.states };

    try {
      await addState({ countryId: data.countryId, state: payload });
      reset();
    } catch (error) {
      console.error("Error adding state:", error);
    } finally {
    }
  };

  const inputClass = {
    input: "w-full border border-primary-gray p-2 outline-none rounded-none",
    label: "text-primary-gray block mb-1",
    error: "text-red-500 text-sm mt-1",
  };

  const allCountries = data?.data ?? [];

  const countryOptions = allCountries.map((country) => ({
    value: country.id,
    label: country.name,
  }));
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <AdminCommonHeader className="!pb-0 pt-6">Add State</AdminCommonHeader>

      <Controller
        control={control}
        name="countryId"
        render={({ field }) => (
          <CommonSelect
            value={field.value}
            onValueChange={field.onChange}
            item={countryOptions}
            placeholder="Choose Country"
            className="w-full"
          />
        )}
      />

      <div>
        <label className={inputClass.label} htmlFor="states">
          Enter States (comma separated)
        </label>
        <Controller
          name="states"
          control={control}
          render={({ field }) => (
            <input
              {...field}
              placeholder="E.g., California, Texas, Ontario"
              className={inputClass.input}
            />
          )}
        />
        {errors.states && (
          <p className={inputClass.error}>{errors.states.message}</p>
        )}
      </div>

      <AdminCommonButton
        disabled={isLoading}
        type="submit"
        className="!w-fit mb-6"
      >
        {isLoading ? "Saving..." : "Add States"}
      </AdminCommonButton>
    </form>
  );
};

export default AddState;
