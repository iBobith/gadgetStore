import React from "react";
import styles from "@/src/components/styles/Features.module.css";

export default function ContactCard({
  title,
  children,
  className,
  boxClassName,
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
  boxClassName?: string;
}) {
  const containerClass = className ? className : styles.featureGrid;
  const articleClass = boxClassName
    ? `${styles.featureBox} ${boxClassName}`
    : styles.featureBox;

  return (
    <div className={containerClass}>
      <article className={articleClass}>
        <h3 style={{ margin: 0, color: "#111111", fontSize: "1.125rem" }}>
          {title}
        </h3>
        <div style={{ marginTop: 8 }}>{children}</div>
      </article>
    </div>
  );
}
