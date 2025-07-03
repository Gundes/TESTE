
import React from 'react';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRatingChange, readonly = false, size = 'w-5 h-5' }) => {
  const stars = [];
  
  for (let i = 1; i <= 10; i++) {
    const isFilled = i <= rating;
    const isHalf = i - 0.5 === rating;
    
    stars.push(
      <button
        key={i}
        type="button"
        disabled={readonly}
        onClick={() => !readonly && onRatingChange && onRatingChange(i)}
        className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-all duration-200`}
      >
        <Star
          className={`${size} ${
            isFilled ? 'text-yellow-400 fill-yellow-400' : 'text-gray-400'
          }`}
        />
      </button>
    );
  }
  
  return (
    <div className="flex items-center gap-1">
      {stars}
      <span className="ml-2 text-sm text-gray-300">
        {rating}/10
      </span>
    </div>
  );
};

export default StarRating;
