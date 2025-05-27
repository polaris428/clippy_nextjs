import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>Clippy</div>
      <nav className={styles.nav}>
        <a href="https://low-smell-b25.notion.site/Clipy-1cad32a959ab80ce9508d97548f9292f?pvs=73" className="font-bold">소개</a>
        <a href="/login" className="font-bold">로그인</a>
      </nav>
    </header>
  );
};

export default Header;
