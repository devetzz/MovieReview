import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as solidStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as regularStar } from '@fortawesome/free-regular-svg-icons';

const StarRating = ({ rating, onRatingChange }) => {
  const [hover, setHover] = useState(0);

  return (
    <div>
      {[...Array(5)].map((star, index) => {
        index += 1; // 1부터 5까지의 평점을 위해 인덱스 조정
        return (
          <button
            type="button"
            key={index}
            className="star-button"
            onClick={() => onRatingChange(index)}
            onMouseEnter={() => setHover(index)}
            onMouseLeave={() => setHover(rating)}
            style={{
              backgroundColor: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              padding: '0 2px',
              fontSize: '1.5em',
              color: (hover || rating) >= index ? 'gold' : 'gray', // 호버 또는 선택된 평점에 따라 색상 변경
              transition: 'color 0.2s ease-in-out',
            }}
          >
            <FontAwesomeIcon icon={(hover || rating) >= index ? solidStar : regularStar} />
          </button>
        );
      })}
    </div>
  );
};

export default StarRating;