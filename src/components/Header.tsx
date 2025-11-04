import Image from "next/image";
import laptopIcon from "../assets/images/icons/laptopIcon.png";
import styles from "./styles/HFer.module.css";

const Header = () => {
  return (
    <nav className={styles.root}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Image src={laptopIcon} alt="Laptop Icon" width={42} height={36} />
          <span className={styles.title}>Gadget Store</span>
        </div>

        <div className={styles.links}>
          <a href="#" className={styles.link}>
            Home
          </a>
          <a href="#" className={styles.link}>
            Products
          </a>
          <a href="#" className={styles.link}>
            Contact
          </a>
          <a href="#" className={styles.link}>
            Cart (0)
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
