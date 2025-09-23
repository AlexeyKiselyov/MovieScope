import css from './loadMoreBtn.module.css';

export default function LoadMoreBtn({
  onMorePage,
}: {
  onMorePage: () => void;
}) {
  return (
    <button className={css.button} onClick={onMorePage}>
      Load more
    </button>
  );
}
