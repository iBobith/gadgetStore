import styles from "../styles/Features.module.css";
import featuresData from "../../assets/homeText.json";
import Image, { type StaticImageData } from "next/image";
import wifi from "../../assets/images/icons/wifiIcon.png";
import phoneWatch from "../../assets/images/icons/phoneWatchIcon.png";
import light from "../../assets/images/icons/lightIcon.png";

const ICONS: Record<string, StaticImageData> = {
  wifiIcon: wifi,
  phoneWatchIcon: phoneWatch,
  lightIcon: light,
};

export default function Features() {
  const raw = featuresData as unknown as Array<Record<string, unknown>>;

  const FEATURES = raw
    .map((f) => {
      const entry = f as Record<string, unknown>;
      const featureId = entry.featureId;
      const featureIcon = entry.featureIcon;
      const featureTitle = entry.featureTitle;
      const featureText = entry.featureText;

      if (!featureId || !featureTitle) return null;

      return {
        id: String(featureId),
        title: String(featureTitle),
        text: String(featureText ?? ""),
        iconModule: ICONS[String(featureIcon)] ?? null,
      };
    })
    .filter(Boolean) as Array<{
    id: string;
    title: string;
    text: string;
    iconModule: StaticImageData | null;
  }>;

  return (
    <div className={styles.features}>
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="padding-bottom-5">Why Choose Us?</h2>
          <div
            className={`flex flex-wrap gap-6 justify-center ${styles.featureGrid}`}
          >
            {FEATURES.map((f) => (
              <div
                className={`${styles.featureBox} w-full sm:w-64 md:w-56 lg:w-52`}
                key={f.id}
              >
                {f.iconModule ? (
                  <Image
                    src={f.iconModule}
                    alt={`${f.title} Icon`}
                    width={64}
                    height={64}
                  />
                ) : null}
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
