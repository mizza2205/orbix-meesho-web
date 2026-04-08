import ProductCard from "../components/ProductCard";
import watch from "../assets/watch-img.avif";

function Home() {
  const products = [
    {
      id: 1,
      name: "Fancy Men Analog Watch",
      price: 180,
      image: watch,
    },
  ];

  return (
    <div className="p-6 grid grid-cols-3 gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}

export default Home;
