import CommonHeader from "@/common/header/CommonHeader";
import React from "react";
import { Link, useLocation } from "react-router-dom";

// Define the shape of an appointment
interface Appointment {
  id: number;
  service: string;
  name: string;
  location: string;
  status: "Pending" | "Working" | "Completed"; // Union type for valid statuses
}

// Define the shape of statusColors
interface StatusColors {
  Pending: string;
  Working: string;
  Completed: string;
}

const DevAndServerDashboard: React.FC = () => {
  const { pathname } = useLocation();
  const appointments: Appointment[] = [
    {
      id: 1,
      service: "Service A",
      name: "Sophia Bennett",
      location: "15 Greenway Street, New York, NY 10001",
      status: "Pending",
    },
    {
      id: 2,
      service: "Service B",
      name: "Daniel Foster",
      location: "27 Maple Avenue, Los Angeles, CA 90012",
      status: "Working",
    },
    {
      id: 3,
      service: "Service C",
      name: "Michael Reynolds",
      location: "89 River Road, Miami, FL 33101",
      status: "Completed",
    },
    {
      id: 4,
      service: "Service D",
      name: "Emma Collins",
      location: "101 Sunset Boulevard, San Francisco, CA 94110",
      status: "Working",
    },
    {
      id: 5,
      service: "Service E",
      name: "John Carter",
      location: "36 Hilltop Drive, Chicago, IL 60614",
      status: "Completed",
    },
  ];

  const server =
    pathname === "/standard-developer-certified" ||
    pathname === "/standard-server-developer/dashboard"
      ? "/standard-developer-certified"
      : "/standard-server-certified";

  console.log("server", server);
  const statusColors: StatusColors = {
    Pending:
      "bg-blue-100 text-blue-600 border border-blue-400 text-center px-4 py-2 rounded-full",
    Working:
      "bg-green-100 text-green-600 border border-green-400 text-center px-4 py-2 rounded-full",
    Completed:
      "bg-yellow-100 text-yellow-600 border border-yellow-400 text-center px-4 py-2 rounded-full",
  };

  return (
    <div className=" min-h-screen">
      <CommonHeader>Overview</CommonHeader>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-10">
        <div className="p-6 bg-green-600 shadow-md text-white rounded-lg text-center text-2xl font-medium h-[175px] flex flex-col items-center justify-center gap-2">
          04
          <span className="text-lg border-t border-white/50 pt-2">
            Recent Appointment List
          </span>
        </div>
        <div className="p-6 bg-[#EAF7E6] shadow-md text-green-800 rounded-lg text-center text-2xl font-medium h-[175px] flex flex-col items-center justify-center gap-2">
          02
          <span className="text-lg border-t border-green-500 pt-2">
            Running Appointment List
          </span>
        </div>
        <div className="p-6 bg-[#EAF7E6] shadow-md text-green-800 rounded-lg text-center text-2xl font-medium h-[175px] flex flex-col items-center justify-center gap-2">
          33
          <span className="text-lg border-t border-green-500 pt-2">
            Completed Appointment List
          </span>
        </div>
      </div>

      {/* Table Headers */}
      <div className="bg-green-600 text-white p-6 rounded-md grid grid-cols-2 sm:grid-cols-5 font-semibold ">
        <span>No</span>
        <span>Service</span>
        <span className="hidden sm:block">Consumer Name</span>
        <span className="hidden sm:block te">Location</span>
        <span className="text-right">Action</span>
      </div>

      {/* Table Data */}
      {appointments.map((appointment, index) => (
        <div
          key={appointment.id}
          className="grid grid-cols-2 sm:grid-cols-5 px-6 py-4  odd:bg-[#E7E9E8] even:bg-light-green items-center  my-4 rounded-md"
        >
          <span>{String(index + 1).padStart(2, "0")}</span>
          <span>{appointment.service}</span>
          <span className="hidden sm:block">{appointment.name}</span>
          <span className="hidden sm:block text-xs sm:text-base ">
            {appointment.location}
          </span>
          <div className={`flex justify-end `}>
            <Link
              to={`${server}/overview/${appointment.id}`}
              className={`w-fit text-sm font-semibold ${
                statusColors[appointment.status]
              }`}
            >
              {appointment.status}
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
};

export default DevAndServerDashboard;
