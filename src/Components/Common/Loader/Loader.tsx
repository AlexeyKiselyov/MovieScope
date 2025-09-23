import { MoonLoader } from 'react-spinners';

import { CSSProperties } from 'react';

const override: CSSProperties = {
  display: 'block',
  margin: '0 auto',
};

import css from './loader.module.css';

export const Loader = ({
  loading,
  color,
}: {
  loading: boolean;
  color: string;
}) => {
  if (!loading) return null;
  return (
    <div className={css.backdrop}>
      <MoonLoader
        color={color}
        loading={loading}
        cssOverride={override}
        size={60}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
    </div>
  );
};
