import axios from "axios";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, Star } from "lucide-react"; // Optional: Use Lucide icons
import toast, { Toaster } from "react-hot-toast";

function ProductCard({ p }) {
  const { _id, title, price, mrp, images, rating, brand } = p;
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const notify = () => toast("Added to cart.");

  const handleAddToCart = async (e) => {
    e.stopPropagation(); // Stop navigation to detail page
    try {
      const userId = "12345";
      addToCart(p); // Update UI immediately (Optimistic UI)
      await axios.post("http://localhost:9000/api/cart/add", {
        userId,
        productId: _id,
      });
      notify();
    } catch (error) {
      console.error("Cart error:", error);
    }
  };

  return (
    <div
      onClick={() => navigate(`/product/${_id}`)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-100 overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 cursor-pointer"
    >
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-slate-100">
        <img
          src={images[0]}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Discount Badge */}
        {
          <div className="absolute top-3 left-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">
            {Math.round(((p.mrp - p.price) / p.mrp) * 100)}% OFF
          </div>
        }

        {/* Quick Add Overlay (Visible on Hover) */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white/90 backdrop-blur-md text-slate-900 py-2.5 rounded-xl font-semibold shadow-lg hover:bg-white flex items-center justify-center gap-2 border border-slate-200"
          >
            <ShoppingCart size={18} />
            Quick Add
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-1">
          <span className="text-[10px] text-blue-600 font-bold uppercase tracking-widest">
            {brand}
          </span>
          <div className="flex items-center gap-1 bg-slate-50 px-1.5 py-0.5 rounded">
            <Star size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium text-slate-600">
              {rating || "4.5"}
            </span>
          </div>
        </div>

        <h3 className="text-slate-800 font-semibold text-sm line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        <div className="mt-auto pt-2 flex items-baseline gap-2">
          <span className="text-lg font-bold text-slate-900">
            ₹{price.toLocaleString()}
          </span>
          {mrp > price && (
            <span className="text-xs text-slate-400 line-through">
              ₹{mrp.toLocaleString()}
            </span>
          )}
        </div>
      </div>
      <Toaster />
    </div>
  );
}

export default ProductCard;
