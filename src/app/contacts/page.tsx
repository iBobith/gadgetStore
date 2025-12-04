import Header from "@/src/components/headerFooter/Header";
import Footer from "@/src/components/headerFooter/Footer";
import ContactCard from "@/src/components/contactPage/Contact";
import styles from "./styles/contacts.module.css";

export default function ContactsPage() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="site-container py-8 flex-grow">
        <div className={styles.contactsContainer}>
          <div className={styles.leftColumn}>
            <h1 className={styles.pageTitle}>
              Contact us by Phone, Email, or Visit us in our Office
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
          </div>

          <div className={styles.rightColumn}>
            <ContactCard
              title="Phone"
              className={styles.contactGrid}
              boxClassName={styles.contactFeatureBox}
            >
              <p style={{ margin: 0 }}>0123456789</p>
            </ContactCard>

            <ContactCard
              title="E-mail"
              className={styles.contactGrid}
              boxClassName={styles.contactFeatureBox}
            >
              <p style={{ margin: 0 }}>gadget@store.com</p>
            </ContactCard>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
