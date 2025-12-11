"use client";
import styles from "../styles/Hero.module.css";
import homeData from "../../assets/homeText.json";
import Image from "next/image";
import hero from "../../assets/images/hero image.png";

type HeroText = {
  heroTitle: string;
  heroText: string;
  contact: string;
  shop: string;
  shopRef: string;
  contactRef: string;
};
type FeatureLike = {
  featureId?: string;
  featureIcon?: string;
  featureTitle?: string;
  featureText?: string;
};

export default function Hero() {
  const arr = homeData as Array<HeroText | FeatureLike>;
  const heroEntry = arr.find((it): it is HeroText =>
    Boolean((it as HeroText).heroText && (it as HeroText).contact)
  );

  const title = heroEntry?.heroTitle;
  const lead = heroEntry?.heroText;
  const contact = heroEntry?.contact;
  const shop = heroEntry?.shop;
  const shopRef = heroEntry?.shopRef;
  const contactRef = heroEntry?.contactRef;

  function handleShopClick() {
    if (shopRef) {
      window.location.href = shopRef;
    }
  }

  function handleContactClick() {
    if (contactRef) {
      window.location.href = contactRef;
    }
  }

  return (
    <div className="w-full">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={styles.hero}>
          <div className={`${styles.heroText} w-full md:w-1/2 lg:w-1/2`}>
            <h1 className={styles.heroTitle}>{title}</h1>
            <p className={styles.heroLead}>{lead}</p>
            <div className={styles.heroActions}>
              <button onClick={handleContactClick}>{contact}</button>
              <button onClick={handleShopClick}>{shop}</button>
            </div>
          </div>

          <div
            className={`${styles.heroImage} w-full md:w-1/2 lg:w-1/2 mt-6 md:mt-0 relative`}
            style={{ maxHeight: 600 }}
          >
            <Image
              src={hero}
              alt="Hero Image"
              style={{ objectFit: "contain", objectPosition: "center" }}
              fill
              priority
            />
          </div>
        </div>
      </div>
    </div>
  );
}
