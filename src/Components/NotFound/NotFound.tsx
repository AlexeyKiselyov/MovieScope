import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { BiError } from 'react-icons/bi';

import css from './notFound.module.css';
import Footer from '../Footer/Footer';
import SEO from '../SEO/SEO';

export default function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/movies', { replace: true });
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <>
      <SEO title="404 — Page not found | MovieScope" noindex />
      <div className={css.container}>
        <div className={css.wrapper}>
          <p className={css.text}>Page not found</p> <BiError size={50} />
        </div>
      </div>

      <Footer />
    </>
  );
}
