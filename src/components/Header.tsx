import styles from "./styles/HFer.module.css";
import headerData from "../assets/header.json";
import Image from "next/image";
import laptopIcon from "../assets/images/icons/laptopIcon.png";

const Header = () => {
  const HEADER = headerData as {
    brandName: string;
    links: Array<{ name: string; href: string }>;
  };

  return (
    <nav className={styles.root}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Image src={laptopIcon} alt="Laptop Icon" width={42} height={36} />
          <span className={styles.title}>{HEADER.brandName}</span>
        </div>
        <div className={styles.links}>
          {HEADER.links.map((link) => (
            <a href={link.href} className={styles.link} key={link.name}>
              {link.name}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
