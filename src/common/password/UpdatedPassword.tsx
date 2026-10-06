import { useState } from "react";
import UpdatedModal from "./UpdatedModal";

const UpdatedPassword = () => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      {/* Trigger button for example */}
      <button
        onClick={() => setShowModal(true)}
        className="px-4 py-2 bg-green-500 text-white rounded"
      >
        Open Modal
      </button>

      {showModal && <UpdatedModal setShowModal={setShowModal} />}
    </div>
  );
};

export default UpdatedPassword;
