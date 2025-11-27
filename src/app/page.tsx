import Header from "../components/headerFooter/Header";
import Footer from "../components/headerFooter/Footer";
import Hero from "../components/homePage/Hero";
import Features from "../components/homePage/Features";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center space-y-8">
      <Header />
      <Hero />
      <Features />
      <Footer />
    </main>
  );
}
