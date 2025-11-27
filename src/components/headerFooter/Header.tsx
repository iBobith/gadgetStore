import styles from "../styles/HFer.module.css";
import headerData from "../../assets/header.json";
import Link from "next/link";
import Image from "next/image";
import laptopIcon from "../../assets/images/icons/laptopIcon.png";

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
            <Link href={link.href} key={link.name} className={styles.link}>
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Header;
