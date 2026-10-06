import CommonButton from "@/common/button/CommonButton";
import CommonSelect from "@/common/button/CommonSelect";
import {
  useAssignDeveloperMutation,
  useAssignServerMutation,
  useGetAllUsersQuery,
  useGetServerAssignmentsQuery,
  useLazyGetSingleUsersQuery,
} from "@/store/LMS/user/userApi";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import UserCard from "../users/UserCard";
import AssignmentCard from "./AssignmentCard";

interface Option {
  label: string;
  value: string;
}

const ConsumerPanel: React.FC = () => {
  const [consumerOptions, setConsumerOptions] = useState<Option[]>([]);
  const [serverOptions, setServerOptions] = useState<Option[]>([]);
  const [developerOptions, setDeveloperOptions] = useState<Option[]>([]);

  const [consumerUser, setConsumerUser] = useState<any>(null);
  const [serverUser, setServerUser] = useState<any>(null);
  const [developerUser, setDeveloperUser] = useState<any>(null);

  const { control, watch, setValue } = useForm<{
    consumerId: string;
    serverId: string;
    developerId: string;
  }>({
    defaultValues: {
      consumerId: "",
      serverId: "",
      developerId: "",
    },
  });

  // ── Queries ────────────────────────────────────────────────────────────────
  const { data } = useGetAllUsersQuery({ limit: 1000 });
  const { data: serverAssignments } = useGetServerAssignmentsQuery();

  const allUsers = data?.data;

  const [getSingleUser] = useLazyGetSingleUsersQuery();
  const [assignServerMutation] = useAssignServerMutation();
  const [assignDeveloperMutation] = useAssignDeveloperMutation();

  // ── Populate dropdowns ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!allUsers?.users) return;

    setConsumerOptions(
      allUsers.users
        .filter((u) => u?.user_type?.name === "CONSUMER")
        .map((u) => ({
          value: u.user_id,
          label: `${u.firstname} ${u.lastname}`,
        })),
    );

    setServerOptions(
      allUsers.users
        .filter((u) => u?.user_type?.name === "SERVER" && u.isAccreditedByAdmin)
        .map((u) => ({
          value: u.user_id,
          label: `${u.firstname} ${u.lastname}`,
        })),
    );

    setDeveloperOptions(
      allUsers.users
        .filter(
          (u) => u?.user_type?.name === "DEVELOPER" && u.isAccreditedByAdmin,
        )
        .map((u) => ({
          value: u.user_id,
          label: `${u.firstname} ${u.lastname}`,
        })),
    );
  }, [allUsers]);

  const selectedConsumer = watch("consumerId");
  const selectedServer = watch("serverId");
  const selectedDeveloper = watch("developerId");

  // ── Fetch consumer user ────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedConsumer) {
      getSingleUser(selectedConsumer).then(({ data }) => setConsumerUser(data));
    } else {
      setConsumerUser(null);
    }
  }, [selectedConsumer]);

  // ── Fetch server user ──────────────────────────────────────────────────────
  useEffect(() => {
    if (selectedServer) {
      getSingleUser(selectedServer).then(({ data }) => setServerUser(data));
      setValue("developerId", "");
    } else {
      setServerUser(null);
    }
  }, [selectedServer, setValue]);

  // ── Fetch developer user ───────────────────────────────────────────────────
  useEffect(() => {
    if (selectedDeveloper) {
      getSingleUser(selectedDeveloper).then(({ data }) =>
        setDeveloperUser(data),
      );
      setValue("serverId", "");
    } else {
      setDeveloperUser(null);
    }
  }, [selectedDeveloper, setValue]);

  // ── Assign handler ─────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(false);

  const handleAssign = async () => {
    if (!selectedConsumer) return;

    try {
      setLoading(true);

      if (selectedServer) {
        await assignServerMutation({
          consumerId: selectedConsumer,
          serverId: selectedServer,
        }).unwrap();
      }

      if (selectedDeveloper) {
        await assignDeveloperMutation({
          consumerId: selectedConsumer,
          developerId: selectedDeveloper,
        }).unwrap();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const [showUsersServer, setShowUsersServer] = useState<boolean>(false);

  return (
    <div className="">
      <div className="flex gap-4   items-baseline-last">
        <Controller
          control={control}
          name="consumerId"
          render={({ field }) => (
            <CommonSelect
              value={field.value}
              onValueChange={field.onChange}
              item={consumerOptions}
              placeholder="Select a Consumer"
            />
          )}
        />

        <Controller
          control={control}
          name="serverId"
          render={({ field }) => (
            <CommonSelect
              value={field.value}
              onValueChange={field.onChange}
              item={serverOptions}
              placeholder="Select a Server"
            />
          )}
        />

        <Controller
          control={control}
          name="developerId"
          render={({ field }) => (
            <CommonSelect
              value={field.value}
              onValueChange={field.onChange}
              item={developerOptions}
              placeholder="Select a Developer"
            />
          )}
        />
        <CommonButton
          className=" !py-2"
          onClick={() => setShowUsersServer(!showUsersServer)}
          disabled={loading}
        >
          {showUsersServer
            ? "Hide Server Assignments"
            : "Show Server Assignments"}
        </CommonButton>
        <CommonButton
          className=" !py-2"
          onClick={() => setShowUsersServer(!showUsersServer)}
          disabled={loading}
        >
          {showUsersServer
            ? "Hide Developer Assignments"
            : "Show Developer Assignments"}
        </CommonButton>
      </div>

      <div
        className={` space-y-4  max-w-xl ${
          consumerUser || serverUser || developerUser ? "py-10" : ""
        }`}
      >
        {consumerUser && <UserCard user={consumerUser} />}
        {serverUser && <UserCard user={serverUser} />}
        {developerUser && <UserCard user={developerUser} />}
      </div>

      {(serverUser || developerUser) && (
        <div className=" flex gap-6">
          <CommonButton disabled={loading} onClick={handleAssign}>
            Assign {serverUser ? "Server" : "Developer"}
          </CommonButton>
        </div>
      )}

      {showUsersServer && (
        <div className=" grid grid-cols-1 md:grid-cols-2  lg:grid-cols-2 xl:grid-cols-3 gap-6 py-10">
          {serverAssignments?.data.map((assignment) => (
            <AssignmentCard
              key={assignment.server.id}
              assignment={assignment}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ConsumerPanel;
