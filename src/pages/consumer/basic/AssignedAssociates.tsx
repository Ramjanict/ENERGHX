import AllAssignedAssociates from "@/components/consumer/basic/assignAssociate/AllAssignedAssociates";
import AssignedAssociatesStart from "@/components/consumer/basic/assignAssociate/AssignedAssociatesStart";
import { useState } from "react";

const AssignedAssociates = () => {
  const [isAssociateOpen, setIsAssociateOpen] = useState(false);

  return (
    <div>
      {!isAssociateOpen ? (
        <AssignedAssociatesStart setIsAssociateOpen={setIsAssociateOpen} />
      ) : (
        <AllAssignedAssociates setIsAssociateOpen={setIsAssociateOpen} />
      )}
    </div>
  );
};

export default AssignedAssociates;
