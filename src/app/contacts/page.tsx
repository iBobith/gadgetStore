import Header from "@/src/components/headerFooter/Header";
import Footer from "@/src/components/headerFooter/Footer";
import ContactCard from "@/src/components/contactPage/Contact";
import styles from "./styles/contacts.module.css";
import Image from "next/image";
import headphoneIcon from "@/src/assets/images/icons/headphoneIcon.png";
import atIcon from "@/src/assets/images/icons/atIcon.png";

export default function ContactsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="site-container py-8 flex-grow">
        <div className={styles.contactsContainer}>
          <div className={styles.leftColumn}>
            <h1 className={styles.pageTitle}>
              Contact us by Phone, Email, or Visit us in our Office!
            </h1>

            <div>
              <p className={styles.addressText}>
                Our address: Station Nord 23456, Greenland
              </p>
            </div>

            <div className={styles.mapWrap}>
              <iframe
                title="Station Nord map"
                src="https://www.google.com/maps?q=Station+Nord&z=7&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
              />
            </div>
            <p className={styles.mapCaption}>Google Maps</p>
          </div>

          <div className={styles.rightColumn}>
            <ContactCard
              icon={
                <Image
                  src={headphoneIcon}
                  alt="Support Icon"
                  width={48}
                  height={48}
                  style={{ paddingBottom: 4 }}
                />
              }
              title="Phone Number"
              className={styles.contactGrid}
              boxClassName={styles.contactFeatureBox}
            >
              <a href="tel:0123456789" style={{ margin: 0, color: "#111111" }}>
                0123456789
              </a>
            </ContactCard>

            <ContactCard
              icon={
                <Image src={atIcon} alt="E-mail Icon" width={72} height={72} />
              }
              title="E-mail"
              className={styles.contactGrid}
              boxClassName={styles.contactFeatureBox}
            >
              <a
                href="mailto:gadget@store.com"
                style={{ margin: 0, color: "#111111" }}
              >
                gadget@store.com
              </a>
            </ContactCard>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
