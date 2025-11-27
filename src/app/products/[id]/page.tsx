import Header from "@/src/components/headerFooter/Header";
import Footer from "@/src/components/headerFooter/Footer";
import Image from "next/image";
import fs from "fs";
import path from "path";
import styles from "./styles/productDetails.module.css";
import ProductDetailsActions from "@/src/components/productsPage/ProductDetailsActions";
import { Product as CardProductType } from "@/src/components/productsPage/cardFucntions/types";

type Product = {
  id?: number | string;
  title?: string;
  price?: number;
  image?: string;
  short_description?: string;
  shortDescription?: string;
  long_description?: string;
  year?: number | string;
  RAM?: string;
  warranty_period?: string;
  features?: string[];
};

export default async function ProductPage({
  params,
}: {
  params: { id: string } | Promise<{ id: string }>;
}) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  const { id } = (await params) as { id: string };
  let product: Product | null = null;

  try {
    const res = await fetch(
      `${apiBase.replace(/\/+$/, "")}/products/${encodeURIComponent(id)}`,
      { cache: "no-store" }
    );
    if (res.ok) product = await res.json();
  } catch (e) {
    console.error("Failed to fetch product:", e);
  }

  if (!product) {
    try {
      const listRes = await fetch(`${apiBase.replace(/\/+$/, "")}/products`, {
        cache: "no-store",
      });
      if (listRes.ok) {
        const list = await listRes.json();
        if (Array.isArray(list)) {
          const found = list.find(
            (it: Product) => String(it.id) === String(id)
          );
          if (found) product = found;
        }
      }
    } catch (e) {
      console.error("Fallback list fetch failed:", e);
    }
  }

  if (!product) {
    return (
      <main className="min-h-screen flex flex-col">
        <Header />
        <div className="site-container py-8 flex-grow">
          <h1>Product not found</h1>
          <p>The product with id {id} was not found.</p>
        </div>
        <Footer />
      </main>
    );
  }

  function titleToSrc(title?: string) {
    return (title || "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .replace(/_+/g, "_");
  }

  let imageSrc: string | undefined = undefined;
  try {
    const slug = titleToSrc(product.title);
    if (slug) {
      const filePath = path.join(
        process.cwd(),
        "public",
        "product_images",
        `${slug}.png`
      );
      if (fs.existsSync(filePath)) {
        imageSrc = `/product_images/${slug}.png`;
      }
    }
  } catch (e) {
    console.error("Image lookup failed:", e);
  }

  if (!imageSrc && product.image) {
    const raw = String(product.image);
    imageSrc =
      raw.startsWith("/") || raw.startsWith("http") || raw.startsWith("data:")
        ? raw
        : `/${raw}`;
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="site-container py-8 flex-grow">
        <div className={`${styles.card} max-w-5xl mx-auto`}>
          <div className={styles.layout}>
            <div className={styles.details}>
              <h1 className={styles.title}>{product.title}</h1>

              {product.long_description ? (
                <div className={styles.longDesc}>
                  {product.long_description}
                </div>
              ) : null}

              <div className={styles.infoRow}>
                {product.year ? (
                  <div className={styles.infoItem}>Year: {product.year}</div>
                ) : null}
                {product.RAM ? (
                  <div className={styles.infoItem}>RAM: {product.RAM}</div>
                ) : null}
                {product.warranty_period ? (
                  <div className={styles.infoItem}>
                    Warranty: {product.warranty_period}
                  </div>
                ) : null}
              </div>

              {Array.isArray(product.features) &&
              product.features.length > 0 ? (
                <div className={styles.features}>
                  <h3 className="">Features:</h3>
                  <ul className={`${styles.featureList} list-disc`}>
                    {product.features.map((f, i) => (
                      <li key={i}>{f}</li>
                    ))}
                  </ul>
                </div>
              ) : null}

              {product.price !== undefined ? (
                <div className={styles.price}>Price: {product.price}€</div>
              ) : null}

              <div className="mt-4">
                <ProductDetailsActions
                  product={product as unknown as CardProductType}
                />
              </div>

              <div className="mt-6">
                <a href="/products" className="text-blue-600 underline">
                  Back to products
                </a>
              </div>
            </div>

            {imageSrc ? (
              <div className={styles.imageWrap}>
                <Image
                  src={imageSrc}
                  alt={String(product.title)}
                  width={520}
                  height={520}
                  style={{ objectFit: "contain" }}
                />
              </div>
            ) : (
              <div className={styles.imageWrap} />
            )}
          </div>
        </div>
      </div>
      <Footer />
    </main>
  );
}
