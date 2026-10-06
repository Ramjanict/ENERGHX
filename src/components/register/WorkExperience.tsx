"use client";
import CommonWrapper from "@/common/CommonWrapper";
import CommonHeader from "@/common/header/CommonHeader";
import { Button } from "@/components/ui/button";
import { ServerDeveloperLoginResponse } from "@/store/auth/types/loginUser";
import {
  useAddExperienceDeveloperMutation,
  useAddExperienceServerMutation,
} from "@/store/LMS/experience/experienceApi";
import { RootState } from "@/store/store";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useRef } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { AiOutlineClose, AiOutlineUpload } from "react-icons/ai";
import { FaAngleDoubleRight, FaPlus, FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import dataSchema, { UserExperience } from "./ValidationSchema";

const WorkExperience = () => {
  const navigate = useNavigate();

  const [addExperienceServer, { isLoading: serverLoading }] =
    useAddExperienceServerMutation();
  const [addExperienceDeveloper, { isLoading: developerLoading }] =
    useAddExperienceDeveloperMutation();

  const { user } = useSelector((state: RootState) => state.auth);
  const serverUser = user as ServerDeveloperLoginResponse | null;

  const userId = serverUser?.data?.id;
  const userType = serverUser?.data?.userType;

  const fileInputRef = useRef<HTMLInputElement>(null);
  const isSubmitting = serverLoading || developerLoading;
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserExperience>({
    resolver: zodResolver(dataSchema),
    defaultValues: {
      experiences: [
        { name: "", address: "", title: "", startDate: "", endDate: "" },
      ],
      publications: [
        {
          publisher: "",
          title: "",
          authorList: "",
          pages: "",
          publicationYear: new Date().getFullYear(),
        },
      ],
      references: [{ name: "" }],
      files: [],
    },
  });

  const experiencesField = useFieldArray({ name: "experiences", control });
  const publicationsField = useFieldArray({ name: "publications", control });
  const referencesField = useFieldArray({ name: "references", control });

  const files = watch("files") || [];

  // File upload handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const selectedFiles = Array.from(e.target.files);
    setValue("files", [...files, ...selectedFiles], { shouldValidate: true });
  };

  const handleRemoveFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setValue("files", newFiles);
  };

  const onSubmit = async (data: UserExperience) => {
    try {
      const formData = new FormData();
      const { files, ...rest } = data;
      formData.append("text", JSON.stringify(rest));
      files?.forEach((file) => formData.append("files", file));

      if (!userId) return;

      if (userType === "SERVER") {
        await addExperienceServer({
          userId,
          experience: formData,
        }).unwrap();
      } else if (userType === "DEVELOPER") {
        await addExperienceDeveloper({
          userId,
          experience: formData,
        }).unwrap();
      }
      navigate("../dashboard");
    } catch (err) {
      console.error(err);
    } finally {
    }
  };

  const inputClass = {
    input: "w-full  border border-border p-2 mb-2 outline-none ",
    label: "text-primary-gray block mb-1",
    error: "text-red-500 text-xs mt-1",
  };
  return (
    <CommonWrapper>
      <CommonHeader>Work Experience</CommonHeader>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
        {/* Experiences */}
        <div>
          <h3 className="font-semibold text-primary-gray mb-2">Experiences</h3>
          {experiencesField.fields.map((item, index) => (
            <div
              key={item.id}
              className="border border-border p-8 mb-4 relative rounded"
            >
              {experiencesField.fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => experiencesField.remove(index)}
                  className="absolute top-2 right-2 text-red-500 cursor-pointer"
                >
                  <FaTrash />
                </button>
              )}
              <input
                {...register(`experiences.${index}.name`)}
                placeholder="Work engagement name"
                className={inputClass.input}
              />
              {errors.experiences?.[index]?.name && (
                <p className="text-red-500">
                  {errors.experiences[index]?.name?.message}
                </p>
              )}

              <input
                {...register(`experiences.${index}.address`)}
                placeholder="Address"
                className={inputClass.input}
              />
              {errors.experiences?.[index]?.address && (
                <p className="text-red-500">
                  {errors.experiences[index]?.address?.message}
                </p>
              )}

              <input
                {...register(`experiences.${index}.title`)}
                placeholder="Job title"
                className={inputClass.input}
              />
              {errors.experiences?.[index]?.title && (
                <p className="text-red-500">
                  {errors.experiences[index]?.title?.message}
                </p>
              )}

              <div className="flex gap-2">
                <input
                  type="date"
                  {...register(`experiences.${index}.startDate`)}
                  className={inputClass.input}
                />
                <input
                  type="date"
                  {...register(`experiences.${index}.endDate`)}
                  className={inputClass.input}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              experiencesField.append({
                name: "",
                address: "",
                title: "",
                startDate: "",
                endDate: "",
              })
            }
            className="flex items-center gap-2 text-green-600 mb-4 cursor-pointer"
          >
            <FaPlus /> Add Experience
          </button>
        </div>

        {/* Publications */}
        <div>
          <h3 className="font-semibold text-primary-gray mb-2">Publications</h3>
          {publicationsField.fields.map((item, index) => (
            <div
              key={item.id}
              className="border border-border p-8 mb-4 relative rounded"
            >
              {publicationsField.fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => publicationsField.remove(index)}
                  className="absolute top-2 right-2 text-red-500 cursor-pointer"
                >
                  <FaTrash />
                </button>
              )}
              <input
                {...register(`publications.${index}.publisher`)}
                placeholder="Publisher"
                className={inputClass.input}
              />
              <input
                {...register(`publications.${index}.title`)}
                placeholder="Title"
                className={inputClass.input}
              />
              <textarea
                {...register(`publications.${index}.authorList`)}
                placeholder="Authors"
                className={inputClass.input}
              />
              <div className="flex gap-2">
                <input
                  {...register(`publications.${index}.pages`)}
                  placeholder="Pages"
                  className={inputClass.input}
                />
                <input
                  type="number"
                  {...register(`publications.${index}.publicationYear`, {
                    valueAsNumber: true,
                  })}
                  placeholder="Year"
                  className={inputClass.input}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={() =>
              publicationsField.append({
                publisher: "",
                title: "",
                authorList: "",
                pages: "",
                publicationYear: new Date().getFullYear(),
              })
            }
            className="flex items-center gap-2 text-green-600 mb-4 cursor-pointer"
          >
            <FaPlus /> Add Publication
          </button>
        </div>

        {/* References */}
        <div>
          <h3 className="font-semibold text-primary-gray mb-2">References</h3>
          {referencesField.fields.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2 mb-2">
              <input
                {...register(`references.${index}.name`)}
                placeholder="Reference name"
                className={inputClass.input}
              />
              {referencesField.fields.length > 1 && (
                <button
                  type="button"
                  onClick={() => referencesField.remove(index)}
                  className="text-red-500 cursor-pointer"
                >
                  <FaTrash />
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => referencesField.append({ name: "" })}
            className="flex items-center gap-2 text-green-600 mb-4 cursor-pointer"
          >
            <FaPlus /> Add Reference
          </button>
        </div>

        {/* File Upload */}
        <div>
          <h3 className="font-semibold text-primary-gray mb-2">
            Recommendation Letters
          </h3>
          <label className="flex items-center gap-2 p-2 border cursor-pointer bg-light-green text-primary-green rounded">
            <AiOutlineUpload /> Upload Files
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              ref={fileInputRef}
              className="hidden"
              onChange={handleFileChange}
            />
          </label>
          <div className="flex gap-2 mt-2 flex-wrap">
            {files.map((file, index) => (
              <div key={index} className="relative border p-2 rounded">
                <p>{file.name}</p>
                <button
                  type="button"
                  onClick={() => handleRemoveFile(index)}
                  className="absolute top-0 right-0 text-red-500 cursor-pointer"
                >
                  <AiOutlineClose />
                </button>
              </div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-primary-green text-white py-3 rounded flex items-center justify-center gap-2"
        >
          {isSubmitting ? "Processing..." : "Submit"} <FaAngleDoubleRight />
        </Button>
      </form>
    </CommonWrapper>
  );
};

export default WorkExperience;
