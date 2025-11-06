import Header from "../components/Header";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Features from "../components/Features";

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
