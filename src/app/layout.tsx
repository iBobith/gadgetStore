import "./globals.css";
import { CartProvider } from "@/src/components/cartPage/CartContext";

export const metadata = {
  title: "Gadget Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-white text-slate-900">
        <CartProvider>
          <main className="flex-grow content-with-footer">{children}</main>
        </CartProvider>
      </body>
    </html>
  );
}
