"use client";

import styles from "../styles/HFer.module.css";
import headerData from "../../assets/header.json";
import Link from "next/link";
import Image from "next/image";
import laptopIcon from "../../assets/images/icons/laptopIcon.png";
import { useCart } from "@/src/components/cartPage/CartContext";

const Header = () => {
  const HEADER = headerData as {
    brandName: string;
    links: Array<{ name: string; href: string }>;
  };

  const { cart } = useCart();

  return (
    <nav className={styles.root}>
      <div className={styles.container}>
        <div className={styles.brand}>
          <Image src={laptopIcon} alt="Laptop Icon" width={42} height={36} />
          <span className={styles.title}>
            <Link href="/">{HEADER.brandName}</Link>
          </span>
        </div>
        <div className={styles.links}>
          {HEADER.links.map((link) => (
            <Link href={link.href} key={link.name} className={styles.link}>
              {link.name}
            </Link>
          ))}
          <Link href="/cart" className={styles.link}>
            Cart ({cart.reduce((count, item) => count + item.quantity, 0)})
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Header;
