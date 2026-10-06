import { Camera } from "lucide-react";
import React, { useRef, useState } from "react";

interface ProfilePhotoUploadProps {
  coverImage?: string;
  avatarImage?: string;
  onAvatarChange?: (file: File) => void;
}

const ProfilePhotoUpload: React.FC<ProfilePhotoUploadProps> = ({
  coverImage = "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200",
  avatarImage,
  onAvatarChange,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | undefined>(avatarImage);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onAvatarChange?.(file);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative w-full h-52 sm:h-64 rounded-2xl bg-cover bg-center"
        style={{ backgroundImage: `url(${coverImage})` }}
      >
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="cursor-pointer absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-24 h-24 rounded-full border-4 border-green-500 overflow-hidden bg-gray-100 flex items-center justify-center group"
        >
          {preview ? (
            <img
              src={preview}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-gray-400 text-xs">No photo</span>
          )}
          <span className="absolute inset-0 bg-black/30 flex items-end justify-center pb-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <Camera className="w-5 h-5 text-white" />
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="mt-16 bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold px-8 py-2.5 rounded-lg transition-colors"
      >
        Update Photo
      </button>
    </div>
  );
};

export default ProfilePhotoUpload;
