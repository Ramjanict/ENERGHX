interface StarRatingProps {
  number: number;
}

const StarRating: React.FC<StarRatingProps> = ({ number }) => {
  return (
    <div className="p-4 max-w-sm mx-auto">
      <div className="text-xl text-yellow-500 gap-1">
        {Array.from({ length: number }).map((_, i) => (
          <span key={i}>★</span>
        ))}
      </div>
    </div>
  );
};

export default StarRating;
