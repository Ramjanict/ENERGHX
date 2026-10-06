import { AiOutlineUpload } from "react-icons/ai";

interface UploadButton {
  title: string;
}

const UploadButton: React.FC<UploadButton> = ({ title }) => {
  return (
    <label className="px-6 py-2 rounded-md ring ring-primary flex  items-center gap-3 bg-light-green w-fit">
      <span className=" text-primary text-2xl">
        <AiOutlineUpload />
      </span>
      <p className="text-primary text-sm sm:text-lg">{title}</p>
      <input type="file" id="" className="hidden" />
    </label>
  );
};

export default UploadButton;
