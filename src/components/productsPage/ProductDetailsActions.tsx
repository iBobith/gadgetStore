"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import EditProduct from "./EditProduct";
import { Product as PType } from "./cardFucntions/types";
import { handleEditProduct } from "./cardFucntions/handleEdit";
import { handleDeleteProduct } from "./cardFucntions/handleDelete";
import { useCart } from "@/src/components/cartPage/CartContext";
import styles from "@/src/components/styles/Card.module.css";
import Image from "next/image";

export default function ProductDetailsActions({ product }: { product: PType }) {
  const { cart = [], addToCart, updateQuantity, removeFromCart } = useCart();
  const [openMenu, setOpenMenu] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const productId = String(product.id);
  const isInCart = cart.some((item) => String(item.id) === productId);
  const cartItem = cart.find((item) => String(item.id) === productId);

  useEffect(() => {
    if (showPopup) {
      const timer = setTimeout(() => setShowPopup(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showPopup]);

  const handleAddToCart = () => {
    addToCart({
      id:
        typeof product.id === "string" ? parseInt(product.id, 10) : product.id,
      title: product.title || "Unknown Title",
      image: product.image || "/default-image.png",
      year: product.year || 0,
      ram: product.ram || "Unknown",
      warranty: product.warranty || "Unknown",
      price: product.price || 0,
      quantity: 1,
    });
    setShowPopup(true);
  };

  const handleDecreaseQuantity = () => {
    if (cartItem && cartItem.quantity > 1) {
      updateQuantity(cartItem.id, cartItem.quantity - 1);
    } else if (cartItem) {
      removeFromCart(cartItem.id);
    }
  };

  const handleIncreaseQuantity = () => {
    if (cartItem) {
      updateQuantity(cartItem.id, cartItem.quantity + 1);
    }
  };

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
            <div
              className={styles.menuItem}
              onClick={() =>
                handleEditProduct(product, undefined, setOpenMenu, setEditing)
              }
              role="button"
            >
              Edit
            </div>
            <div
              className={styles.menuItem}
              onClick={
                !deleting
                  ? () =>
                      handleDeleteProduct(product, { setOpenMenu, setDeleting })
                  : undefined
              }
              role="button"
              aria-disabled={deleting}
            >
              Delete
            </div>
          </div>
        ) : null}
      </div>

      {isInCart && cartItem ? (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            type="button"
            className={styles.btnMinus}
            onClick={handleDecreaseQuantity}
          >
            {cartItem.quantity > 1 ? (
              "-"
            ) : (
              <Image
                src="/product_images/icons/binIcon.png"
                alt="Remove"
                width={20}
                height={20}
              />
            )}
          </button>
          <span>{cartItem.quantity}</span>
          <button
            type="button"
            className={styles.btnPlus}
            onClick={handleIncreaseQuantity}
          >
            +
          </button>
        </div>
      ) : (
        <button type="button" className={styles.btn2} onClick={handleAddToCart}>
          Add to cart
        </button>
      )}

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

      {showPopup && (
        <div className={styles.popup}>{product.title} added to the cart!</div>
      )}
    </div>
  );
}
