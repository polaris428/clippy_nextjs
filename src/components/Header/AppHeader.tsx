import styles from '../Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Clippy</div>
      <nav className={styles.nav}>
        <a href="/folders">내 폴더</a>
        <a href="/about">소개</a>
        <a href="/login" className={styles.login}>로그인</a>
      </nav>
    </header>
  );
};

export default Header;
