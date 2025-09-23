import { useState } from 'react';

import css from './MovieReviewItem.module.css';

const notFoundImage =
  'https://img.freepik.com/free-vector/blue-circle-with-white-user_78370-4707.jpg?semt=ais_hybrid&w=740';

interface Review {
  author: string;
  content: string;
  avatar: string | null;
}

const MovieReviewItem = ({ author, content, avatar }: Review) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleReview = () => {
    setIsExpanded(prev => !prev);
  };

  return (
    <>
      <div onClick={toggleReview}>
        <div className={css.autorWrapper}>
          <img
            src={
              avatar
                ? `https://image.tmdb.org/t/p/w500${avatar}`
                : notFoundImage
            }
            alt={author}
            className={css.autorAvatar}
          />
          <p className={css.reviewsAutor}>{author}</p>
        </div>
        <p
          className={`${css.reviewsContent} ${isExpanded ? css.expanded : ''}`}
        >
          {content}
        </p>
      </div>
    </>
  );
};

export default MovieReviewItem;
