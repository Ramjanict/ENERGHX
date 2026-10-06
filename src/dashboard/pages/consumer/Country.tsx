import AddCountry from "@/dashboard/components/consumerDashboard/country/AddCountry";
import AddState from "@/dashboard/components/consumerDashboard/country/AddState";

const Country = () => {
  return (
    <div className=" overflow-y-hidden">
      <AddCountry />
      <AddState />
    </div>
  );
};

export default Country;
