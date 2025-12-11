"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../styles/Card.module.css";
import EditProduct from "./EditProduct";
import { Product, RouterLike } from "./cardFucntions/types";
import { handleDetails as handleDetailsFn } from "./cardFucntions/handleDetails";
import { handleEditProduct } from "./cardFucntions/handleEdit";
import { handleDeleteProduct } from "./cardFucntions/handleDelete";

function titleToSrc(title: string) {
  return title
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_");
}

export default function Card({
  product,
  onEdit,
  onDelete,
  onDetails,
}: {
  product: Product;
  onEdit?: (p: Product) => void;
  onDelete?: (p: Product) => void;
  onDetails?: (p: Product) => void;
}) {
  const img = product.image
    ? product.image.startsWith("/") ||
      product.image.startsWith("http") ||
      product.image.startsWith("data:")
      ? product.image
      : `/product_images/${titleToSrc(product.title)}.png`
    : `/product_images/${titleToSrc(product.title)}.png`;

  const [openMenu, setOpenMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    function handleDocClick(e: MouseEvent) {
      if (!menuRef.current) return;
      if (e.target instanceof Node && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    }

    if (openMenu) document.addEventListener("click", handleDocClick);
    return () => document.removeEventListener("click", handleDocClick);
  }, [openMenu]);

  function handleEdit(e: React.MouseEvent) {
    e.stopPropagation();
    handleEditProduct(
      product,
      onEdit,
      (v) => setOpenMenu(v),
      (v) => setEditing(v)
    );
  }

  function handleDelete(e: React.MouseEvent) {
    e.stopPropagation();
    void (async () => {
      await handleDeleteProduct(product, {
        onDelete,
        setOpenMenu: (v: boolean) => setOpenMenu(v),
        setDeleting: (v: boolean) => setDeleting(v),
      });
    })();
  }

  function handleDetails(e: React.MouseEvent) {
    e.stopPropagation();
    handleDetailsFn(product, onDetails, router as RouterLike);
  }

  return (
    <article className={styles.card}>
      <div onClick={handleDetails} style={{ cursor: "pointer" }}>
        <h3 className={styles.title}>{product.title}</h3>
        {product.price !== undefined ? (
          <p className={styles.price}>Price: {product.price}€</p>
        ) : null}
        <div className={styles.imageWrapper}>
          <Image
            src={img}
            alt={product.title}
            fill
            style={{ objectFit: "contain" }}
          />
        </div>
        {product.shortDescription ? (
          <p className={styles.description}>{product.shortDescription}</p>
        ) : null}
      </div>

      <div className={styles.actions}>
        <button
          type="button"
          className={`${styles.btn}`}
          onClick={handleDetails}
        >
          Details
        </button>
        <button
          type="button"
          className={`${styles.btn}`}
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu((v) => !v);
          }}
        >
          Menu
        </button>
      </div>

      {openMenu ? (
        <div
          className={styles.menu}
          ref={menuRef}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={styles.menuItem} onClick={handleEdit} role="button">
            Edit
          </div>
          <div
            className={styles.menuItem}
            onClick={!deleting ? handleDelete : undefined}
            role="button"
            aria-disabled={deleting}
          >
            Delete
          </div>
        </div>
      ) : null}
      {editing && (
        <EditProduct
          product={product}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            if (typeof window !== "undefined") window.location.reload();
          }}
        />
      )}
    </article>
  );
}
