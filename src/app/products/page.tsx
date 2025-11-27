import Header from "@/src/components/headerFooter/Header";
import Footer from "@/src/components/headerFooter/Footer";
import Card from "../../components/productsPage/Card";
import cardStyles from "@/src/components/styles/Card.module.css";
import AddProduct from "@/src/components/productsPage/AddProduct";

type Product = {
  id: number;
  title: string;
  price: number;
  shortDescription: string;
};

export default async function ProductsPage() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";
  let products: Product[] = [];

  try {
    const res = await fetch(`${apiBase}/products`, { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        products = data.map((item: any) => {
          const rawShort =
            item.short_description ?? item.shortDescription ?? "";
          const shortDescription = String(rawShort).replace(/\s+/g, " ").trim();

          return {
            ...item,
            id: typeof item.id === "string" ? Number(item.id) : item.id,
            shortDescription,
          };
        });
      }
    }
  } catch (e) {
    console.error("Failed to fetch products:", e);
  }

  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <div className="site-container py-8 flex-grow">
        <div className="flex items-center justify-end mb-6">
          <div>
            <AddProduct />
          </div>
        </div>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className={cardStyles.productsGrid}>
            {products.map((p: Product) => (
              <Card key={p.id} product={p} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </main>
  );
}
