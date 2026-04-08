import { useNavigate } from "react-router-dom";
import watch from "../assets/watch-img.avif";

function ProductDetails() {
  const navigate = useNavigate();

  const handleAddToCart = () => {
    navigate("/cart");
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <img src={watch} className="w-full h-60 object-cover rounded" />

      <h1 className="text-2xl font-bold mt-4">Fancy Men Analog Watch</h1>
      <p className="text-lg text-blue-600 font-semibold mt-2">₹180</p>

      <button
        onClick={handleAddToCart}
        className="bg-green-500 text-white px-4 py-2 mt-4 w-full rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductDetails;
