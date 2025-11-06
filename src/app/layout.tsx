import "./globals.css";

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
        <main className="flex-grow content-with-footer">{children}</main>
      </body>
    </html>
  );
}
