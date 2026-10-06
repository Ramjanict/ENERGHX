import { type FC } from "react";
import { FaLongArrowAltRight } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

interface PaginationProps {
  title: string;
  showText: string;
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onToggleShowAll?: () => void;
  showAll?: boolean;
}

const Pagination: FC<PaginationProps> = ({
  title,
  showText,
  totalPages,
  currentPage,
  onPageChange,
  showAll,
  onToggleShowAll,
}) => {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-between items-center text-jet-black text-base">
      <div className="hidden md:block">
        <p>{showText}</p>
      </div>

      {onToggleShowAll && (
        <button
          onClick={onToggleShowAll}
          className="flex items-center underline md:text-sm sm:text-lg gap-1 cursor-pointer hover:text-sunset-orange transition"
        >
          <p className="text-sm sm:text-lg">{title}</p>
          <span className="hidden sm:block">
            <FaLongArrowAltRight />
          </span>
        </button>
      )}

      <div className="flex items-center border border-border rounded-xl overflow-hidden">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1 || showAll}
          className="border-r border-border text-primary text-xl sm:text-2xl cursor-pointer p-1 sm:p-4 disabled:cursor-not-allowed"
        >
          <IoIosArrowBack />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            disabled={showAll}
            onClick={() => onPageChange(page)}
            className={`p-1 sm:p-4 border-r border-border cursor-pointer ${
              currentPage === page
                ? "bg-primary text-white border-0 font-bold"
                : ""
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages || showAll}
          className="text-primary text-xl sm:text-2xl cursor-pointer p-1 sm:p-4 disabled:cursor-not-allowed"
        >
          <IoIosArrowForward />
        </button>
      </div>
    </div>
  );
};

export default Pagination;
