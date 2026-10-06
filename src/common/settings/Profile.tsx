import camera from "@/assets/images/camera.svg";
import banner from "@/assets/images/profile-banner.jpeg";
import { useState } from "react";

interface Item {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value?: string;
}

const Profile = () => {
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isLoadingPhoto, setIsLoadingPhoto] = useState(false);

  const SelectUserType = "CONSUMER"; // for test
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePhoto = async () => {
    if (!selectedFile) return;
    setIsLoadingPhoto(true);
    const formdata = new FormData();
    formdata.append("image", selectedFile);
    try {
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingPhoto(false);
    }
  };

  return (
    <>
      {/* Banner & Profile Photo */}
      <div className="relative w-full max-h-60">
        <img
          src={banner}
          alt="Banner"
          className="w-full max-h-60 object-cover rounded-lg"
        />
        <label className="absolute left-1/2 -bottom-10 transform -translate-x-1/2 cursor-pointer">
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-2 border-primary">
            <img
              src={preview || ""}
              alt="Profile"
              className="w-full h-full object-cover rounded-full"
            />
            <div className="absolute bottom-0 w-full bg-black/50 flex justify-center items-center py-1">
              <img className="w-5 h-5" src={camera} alt="Camera" />
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>
        </label>
      </div>

      {/* Update Photo Button */}
      {SelectUserType === "CONSUMER" ? (
        <>
          <div className="pt-16 flex justify-center">
            <button
              onClick={handlePhoto}
              disabled={!selectedFile || isLoadingPhoto}
              className="bg-primary text-white text-lg rounded-md px-6 py-2 hover:bg-primary-dark transition cursor-pointer disabled:cursor-not-allowed disabled:bg-green-500"
            >
              {isLoadingPhoto ? "Updating..." : "Update Photo"}
            </button>
          </div>
          <div className="">{/* <SignUp /> */}</div>
        </>
      ) : (
        <div className="pt-10">
          {/* <UserSignUp title="Update Profile" /> */}
        </div>
      )}
    </>
  );
};

export default Profile;
