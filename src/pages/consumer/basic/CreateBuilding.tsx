import CommonButton from "@/common/button/CommonButton";
import CommonSelect from "@/common/button/CommonSelect";
import SectionHeader from "@/common/header/SectionHeader";
import { inputClass } from "@/pages/Login";
import {
  useCreatingBuildingMutation,
  useGetAllBuildingsTypesQuery,
} from "@/store/consumer/basic/building/buildingApi";
import {
  useGetAllCommoditiesQuery,
  useGetAllCountriesQuery,
  useGetAllServicesQuery,
  useGetAllStatesQuery,
} from "@/store/LMS/user/userApi";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import {
  Control,
  Controller,
  FieldErrors,
  useFieldArray,
  useForm,
  UseFormRegister,
  useWatch,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";

const commoditySchema = z.object({
  state: z.string().nonempty("Please select a state"),
  commodity: z.string().nonempty("Please select a commodity"),
  accountNumber: z.string().nonempty("Account number is required"),
  units: z.string().nonempty("Units is required"),
  commCountry: z.string().nonempty("Please select a country"),
  utility: z.string().nonempty("Please select a utility company"),
  phone: z
    .string()
    .nonempty("Phone number is required")
    .regex(/^\+?\d{7,15}$/, "Enter a valid phone number"),
});

const formSchema = z.object({
  name: z.string().nonempty("Building name is required"),
  type: z.string().nonempty("Please select a building type"),
  subType: z.string().nonempty("Please select a sub-building type"),
  street: z
    .string()
    .nonempty("Street number is required")
    .regex(/^\d+$/, "Street number must contain digits only"),
  city: z.string().nonempty("City is required"),
  postalCode: z.string().nonempty("Postal code is required"),
  occupants: z
    .string()
    .nonempty("Number of occupants is required")
    .regex(/^\d+$/, "Must be a number"),
  streetAddress: z.string().nonempty("Street address is required"),
  commodities: z.array(commoditySchema).min(1, "Add at least one commodity"),
});

export type BuildingPayload = z.infer<typeof formSchema>;

const emptyCommodity = {
  state: "",
  commodity: "",
  accountNumber: "",
  units: "",
  commCountry: "",
  utility: "",
  phone: "",
};

/* ---- Maps form shape -> API payload shape (per Postman example) ---- */
const buildCreateBuildingPayload = (data: BuildingPayload) => ({
  building_name: data.name,
  streetAddress: data.streetAddress,
  streetNumber: data.street,
  type: data.type,
  subBuilding: data.subType,
  postalCode: data.postalCode,
  city: data.city,
  numberOfOccupants: data.occupants,
  commodities: data.commodities.map((c) => ({
    type: c.commodity,
    utilityCompany: {
      id: c.utility,
      accountNumber: c.accountNumber,
      country: c.commCountry,
      state: c.state,
      units: c.units,
      alternatePhoneNumber: c.phone,
    },
  })),
});

type CommodityRowProps = {
  index: number;
  control: Control<BuildingPayload>;
  register: UseFormRegister<BuildingPayload>;
  errors: FieldErrors<BuildingPayload>;
  countryOptions: { label: string; value: string }[];
  commodityOptions: { label: string; value: string }[];
};

const CommodityRow: React.FC<CommodityRowProps> = ({
  index,
  control,
  register,
  errors,
  countryOptions,
  commodityOptions,
}) => {
  const commCountry = useWatch({
    control,
    name: `commodities.${index}.commCountry`,
  });
  const selectedState = useWatch({
    control,
    name: `commodities.${index}.state`,
  });
  const selectedCommodity = useWatch({
    control,
    name: `commodities.${index}.commodity`,
  });

  const { data: states } = useGetAllStatesQuery(commCountry, {
    skip: !commCountry,
  });

  const { data: utilities } = useGetAllServicesQuery(
    {
      countryId: commCountry,
      stateId: selectedState,
      commodityId: selectedCommodity,
    },
    {
      skip: !commCountry || !selectedState || !selectedCommodity,
    },
  );

  const stateOptions =
    states?.data?.map((s) => ({ label: s.name, value: s.id })) ?? [];

  const utilityOptions =
    utilities?.data?.map((u) => ({ label: u.name, value: u.id })) ?? [];

  return (
    <div className="space-y-2">
      <div className="bg-primary-green text-white w-6 h-6 rounded-full flex justify-center items-center">
        {index + 1}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <Controller
            control={control}
            name={`commodities.${index}.commCountry`}
            render={({ field }) => (
              <CommonSelect
                value={field.value}
                onValueChange={field.onChange}
                item={countryOptions}
                placeholder="Select Country"
                className="w-full"
              />
            )}
          />
          {errors.commodities?.[index]?.commCountry && (
            <p className={inputClass.error}>
              {errors.commodities[index]?.commCountry?.message}
            </p>
          )}
        </div>

        <div>
          <Controller
            control={control}
            name={`commodities.${index}.state`}
            render={({ field }) => (
              <CommonSelect
                value={field.value}
                onValueChange={field.onChange}
                item={stateOptions}
                placeholder="Select State"
                className="w-full"
              />
            )}
          />
          {errors.commodities?.[index]?.state && (
            <p className={inputClass.error}>
              {errors.commodities[index]?.state?.message}
            </p>
          )}
        </div>

        <div>
          <Controller
            control={control}
            name={`commodities.${index}.commodity`}
            render={({ field }) => (
              <CommonSelect
                value={field.value}
                onValueChange={field.onChange}
                item={commodityOptions}
                placeholder="Select Commodity"
                className="w-full"
              />
            )}
          />
          {errors.commodities?.[index]?.commodity && (
            <p className={inputClass.error}>
              {errors.commodities[index]?.commodity?.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Account Number"
            className={inputClass.input}
            {...register(`commodities.${index}.accountNumber`)}
          />
          {errors.commodities?.[index]?.accountNumber && (
            <p className={inputClass.error}>
              {errors.commodities[index]?.accountNumber?.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Units"
            className={inputClass.input}
            {...register(`commodities.${index}.units`)}
          />
          {errors.commodities?.[index]?.units && (
            <p className={inputClass.error}>
              {errors.commodities[index]?.units?.message}
            </p>
          )}
        </div>

        <div>
          <Controller
            control={control}
            name={`commodities.${index}.utility`}
            render={({ field }) => (
              <CommonSelect
                value={field.value}
                onValueChange={field.onChange}
                item={utilityOptions}
                placeholder="Utility Company"
                className="w-full"
              />
            )}
          />
          {errors.commodities?.[index]?.utility && (
            <p className={inputClass.error}>
              {errors.commodities[index]?.utility?.message}
            </p>
          )}
        </div>

        <div>
          <input
            type="tel"
            placeholder="Phone Number"
            className={inputClass.input}
            {...register(`commodities.${index}.phone`)}
          />
          {errors.commodities?.[index]?.phone && (
            <p className={inputClass.error}>
              {errors.commodities[index]?.phone?.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

const CreateBuilding = () => {
  const {
    handleSubmit,
    control,
    register,
    reset,
    setValue,
    formState: { errors },
  } = useForm<BuildingPayload>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      subType: "",
      street: "",
      city: "",
      postalCode: "",
      occupants: "",
      streetAddress: "",
      commodities: [emptyCommodity],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "commodities",
  });

  const [creatingBuilding, { isLoading: isCreating }] =
    useCreatingBuildingMutation();
  const navigate = useNavigate();
  const onSubmit = async (data: BuildingPayload) => {
    try {
      const payload = buildCreateBuildingPayload(data);
      await creatingBuilding(payload).unwrap();
      navigate("../");
      reset();
    } catch (err) {
      console.error("Failed to create building:", err);
    }
  };

  const selectedBuildingType = useWatch({ control, name: "type" });

  const { data: types } = useGetAllBuildingsTypesQuery();
  const { data: countries } = useGetAllCountriesQuery();
  const { data: commodities } = useGetAllCommoditiesQuery();

  const buildingTypeOptions =
    types?.data?.map((t) => ({ label: t.name, value: t.id })) ?? [];

  const subBuildingTypeOptions = useMemo(() => {
    const activeType = types?.data?.find((t) => t.id === selectedBuildingType);
    return (
      activeType?.subBuildings?.map((s) => ({
        label: s.name,
        value: s.id,
      })) ?? []
    );
  }, [types, selectedBuildingType]);

  useEffect(() => {
    setValue("subType", "");
  }, [selectedBuildingType, setValue]);

  const countryOptions =
    countries?.data?.map((c) => ({ label: c.name, value: c.id })) ?? [];

  const commodityOptions =
    commodities?.data?.map((c) => ({ label: c.name, value: c.id })) ?? [];

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start justify-between gap-3 ">
        <SectionHeader title="Building information" />
        <CommonButton
          variant="destructive"
          to="/basic-consumer/building"
          className="w-full sm:w-auto"
        >
          Cancel
        </CommonButton>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <input
            type="text"
            placeholder="Building Name"
            className={inputClass.input}
            {...register("name")}
          />
          {errors.name && (
            <p className={inputClass.error}>{errors.name.message}</p>
          )}
        </div>

        <div>
          <Controller
            control={control}
            name="type"
            render={({ field }) => (
              <CommonSelect
                value={field.value}
                onValueChange={field.onChange}
                item={buildingTypeOptions}
                placeholder="Select Building Type"
                className="w-full"
              />
            )}
          />
          {errors.type && (
            <p className={inputClass.error}>{errors.type.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Street Number"
            className={inputClass.input}
            {...register("street")}
          />
          {errors.street && (
            <p className={inputClass.error}>{errors.street.message}</p>
          )}
        </div>

        <div>
          <Controller
            control={control}
            name="subType"
            render={({ field }) => (
              <CommonSelect
                value={field.value}
                onValueChange={field.onChange}
                item={subBuildingTypeOptions}
                placeholder="Select Sub-Building"
                className="w-full"
              />
            )}
          />
          {errors.subType && (
            <p className={inputClass.error}>{errors.subType.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="City"
            className={inputClass.input}
            {...register("city")}
          />
          {errors.city && (
            <p className={inputClass.error}>{errors.city.message}</p>
          )}
        </div>

        <div>
          <input
            type="number"
            placeholder="Number of Occupants"
            className={inputClass.input}
            {...register("occupants")}
          />
          {errors.occupants && (
            <p className={inputClass.error}>{errors.occupants.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Street Address"
            className={inputClass.input}
            {...register("streetAddress")}
          />
          {errors.streetAddress && (
            <p className={inputClass.error}>{errors.streetAddress.message}</p>
          )}
        </div>

        <div>
          <input
            type="text"
            placeholder="Postal Code"
            className={inputClass.input}
            {...register("postalCode")}
          />
          {errors.postalCode && (
            <p className={inputClass.error}>{errors.postalCode.message}</p>
          )}
        </div>
      </div>

      <SectionHeader title="Commodities" />

      {fields.map((field, index) => (
        <CommodityRow
          key={field.id}
          index={index}
          control={control}
          register={register}
          errors={errors}
          countryOptions={countryOptions}
          commodityOptions={commodityOptions}
        />
      ))}

      <div className="flex flex-wrap gap-2 pt-1">
        <CommonButton
          type="button"
          variant="secondary"
          onClick={() => append(emptyCommodity)}
        >
          Add Commodity
        </CommonButton>
        <CommonButton
          type="button"
          variant="destructive"
          onClick={() => fields.length > 1 && remove(fields.length - 1)}
        >
          Remove Commodity
        </CommonButton>
        <CommonButton
          type="submit"
          disabled={isCreating}
          isLoading={isCreating}
          loadingText="Creating..."
        >
          Create Building
        </CommonButton>
      </div>
    </form>
  );
};

export default CreateBuilding;
