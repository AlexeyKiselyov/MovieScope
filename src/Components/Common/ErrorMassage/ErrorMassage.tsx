import css from './errorMessage.module.css';

export default function ErrorMassage() {
  return (
    <p className={css.message}>
      Whoops, something went wrong! Please try reloading this page!
    </p>
  );
}
