import Navbar from "./components/Navbar";
import ProductGrid from "./components/ProductsGrid";
import Hero from "./components/Hero";
import Footer from "./components/Footer";

export default async function Home() {

  return (
    <>
      <Navbar />
      <Hero />
      <ProductGrid />
      <Footer />
    </>
  );
}