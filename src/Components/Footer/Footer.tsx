import Container from '../Common/Container/Container';
import css from './footer.module.css';

export default function Footer() {
  return (
    <footer className={css.footer}>
      <Container>
        <div className={css.footerContainer}>
          <div className={css.footerLinks}>
            <a href="javascript:void(0)" className={css.footerLink}>
              Privacy Policy
            </a>
            <a href="javascript:void(0)" className={css.footerLink}>
              Terms of Use
            </a>
            <a href="javascript:void(0)" className={css.footerLink}>
              Unsubscribe
            </a>
          </div>

          <p className={css.footerCopyright}>
            Copyright ©2025 All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}
