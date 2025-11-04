import styles from "./styles/HFer.module.css";

const Footer = () => {
  return (
    <footer className={`${styles.root} ${styles.footer} ${styles.fixed}`}>
      <div className={styles.container}>
        <div>© All Rights Reserved</div>
      </div>
    </footer>
  );
};

export default Footer;
