import css from './container.module.css';

interface ContainerProps {
  children?: React.ReactNode;
}

export default function Container({ children }: ContainerProps) {
  return <div className={css.container}>{children}</div>;
}
