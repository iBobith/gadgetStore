"use client";

import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import EditProduct from "./EditProduct";
import { Product as PType } from "./cardFucntions/types";
import { handleEditProduct } from "./cardFucntions/handleEdit";
import { handleDeleteProduct } from "./cardFucntions/handleDelete";
import styles from "@/src/components/styles/Card.module.css";

export default function ProductDetailsActions({ product }: { product: PType }) {
  const [openMenu, setOpenMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  function onEdit() {
    handleEditProduct(
      product,
      undefined,
      (v) => setOpenMenu(v),
      (v) => setEditing(v)
    );
  }

  async function onDelete() {
    await handleDeleteProduct(product, {
      setOpenMenu: (v) => setOpenMenu(v),
      setDeleting: (v) => setDeleting(v),
    });
    try {
      router.refresh();
    } catch (err) {
      console.error("refresh failed", err);
    }
  }

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
      <div style={{ position: "relative", display: "inline-block" }}>
        <button
          type="button"
          className={styles.btn}
          onClick={(e) => {
            e.stopPropagation();
            setOpenMenu((v) => !v);
          }}
        >
          Menu
        </button>

        {openMenu ? (
          <div
            className={styles.menu}
            ref={menuRef}
            onClick={(e) => e.stopPropagation()}
            style={{ top: "100%", left: 0, bottom: "auto" }}
          >
            <div className={styles.menuItem} onClick={onEdit} role="button">
              Edit
            </div>
            <div
              className={styles.menuItem}
              onClick={!deleting ? onDelete : undefined}
              role="button"
              aria-disabled={deleting}
            >
              Delete
            </div>
          </div>
        ) : null}
      </div>

      <button
        type="button"
        className={styles.btn}
        onClick={() => {
          // TODO
          console.log("Add to cart clicked for", product?.title);
        }}
      >
        Add to cart
      </button>

      {editing && (
        <EditProduct
          product={product}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false);
            try {
              router.refresh();
            } catch (err) {
              console.error("refresh failed", err);
            }
          }}
        />
      )}
    </div>
  );
}
