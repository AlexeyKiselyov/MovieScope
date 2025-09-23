import { Link, NavLink } from 'react-router-dom';

import css from './navigation.module.css';
import logo from '../../images/logo.png';
import Container from '../Common/Container/Container';

const buildLinkClass = ({ isActive }: { isActive: boolean }) => {
  return isActive ? `${css.link} ${css.active}` : css.link;
};

export default function Navigation() {
  return (
    <Container>
      <header className={css.header}>
        <nav className={css.navigation}>
          <div className={css.menuLinks}>
            <NavLink to={'/'} className={buildLinkClass}>
              Home
            </NavLink>
            <NavLink to={'/movies'} className={buildLinkClass}>
              Movies
            </NavLink>
          </div>

          <Link to={'/'}>
            <img src={logo} alt="Logo" className={css.logo} />
          </Link>
        </nav>
      </header>
    </Container>
  );
}
