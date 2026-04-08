import { Link } from "react-router-dom";

function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 p-4">
      {/* Image */}
      <div className="w-full h-60 overflow-hidden rounded-xl">
        <img
          src={product.image}
          className="w-full h-60 object-cover hover:scale-105 transition duration-300"
        />
      </div>

      {/* Details */}
      <div className="mt-3">
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>

        <p className="text-blue-600 font-bold text-md mt-1">₹{product.price}</p>
      </div>

      {/* Button */}
      <Link to={`/product/${product.id}`}>
        <button className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
          View Details
        </button>
      </Link>
    </div>
  );
}

export default ProductCard;
