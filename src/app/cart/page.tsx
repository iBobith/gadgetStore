"use client";

import Header from "@/src/components/headerFooter/Header";
import Footer from "@/src/components/headerFooter/Footer";
import styles from "./styles/cart.module.css";
import Link from "next/link";
import { useCart } from "@/src/components/cartPage/CartContext";
import Image from "next/image";

export default function CartPage() {
  const { cart, updateQuantity, removeFromCart, calculateTotal } = useCart();

  function titleToSrc(title: string) {
    return title
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .replace(/_+/g, "_");
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center space-y-8">
      <Header />
      <div className={styles.cartHeader}>
        <h1 className={styles.cartTitle}>Shopping Cart</h1>
        <h2 className={styles.cartTotal}>
          Total: ${calculateTotal().toFixed(2)}
        </h2>
      </div>

      <div className={styles.cartContainer}>
        {cart.length === 0 ? (
          <div className={styles.cartCard}>
            <p className={styles.emptyCartMessage}>Your cart is empty.</p>
            <p className={styles.emptyCartMessage}>
              Go to{" "}
              <Link href="/products" className={styles.emptyCartLink}>
                products page
              </Link>
            </p>
          </div>
        ) : (
          <div>
            {cart.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <Image
                  src={
                    item.image?.startsWith("/product_images/")
                      ? item.image
                      : `/product_images/${titleToSrc(item.title)}.png`
                  }
                  alt={item.title || "Product Image"}
                  className={styles.cartImage}
                  width={150}
                  height={150}
                />
                <div>
                  <Link
                    href={`/products/${item.id}`}
                    className={styles.cartItemTitle}
                  >
                    {item.title}
                  </Link>
                  <p>Year: {item.year}</p>
                  <p>RAM: {item.ram}</p>
                  <p>Warranty: {item.warranty}</p>
                  <p>Price: ${item.price.toFixed(2)}</p>
                </div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    justifyContent: "space-evenly",
                  }}
                >
                  {item.quantity > 1 ? (
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className={styles.btn2}
                      style={{ fontWeight: "bold" }}
                    >
                      -
                    </button>
                  ) : (
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={styles.btn2}
                    >
                      <Image
                        src="/product_images/icons/binIcon.png"
                        alt="Remove"
                        width={20}
                        height={20}
                      />
                    </button>
                  )}
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className={styles.btn1}
                    style={{ fontWeight: "bold" }}
                  >
                    +
                  </button>
                  <div className={styles.cartItemTotal}>
                    <p>Total: ${(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
