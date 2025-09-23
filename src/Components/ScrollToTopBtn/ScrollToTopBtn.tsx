import css from './scrollToTopBtn.module.css';
import { FaArrowUp } from 'react-icons/fa';

interface ScrollToTopBtnProps {
  scrollToTop: () => void;
}

export default function ScrollToTopBtn({ scrollToTop }: ScrollToTopBtnProps) {
  return (
    <button onClick={scrollToTop} className={css.scrollToTopButton}>
      <FaArrowUp />
    </button>
  );
}
