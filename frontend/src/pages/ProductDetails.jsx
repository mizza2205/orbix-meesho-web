import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";
import {
  Star,
  Truck,
  ShieldCheck,
  RotateCcw,
  ShoppingCart,
  ChevronRight,
} from "lucide-react";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState("");
  const { addToCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0); // Senior move: reset scroll on mount
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`http://localhost:9000/api/products/${id}`);
        setProduct(res.data);
        setActiveImg(res.data.images[0]);
        setLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) return <DetailSkeleton />;
  if (!product) return <ErrorMessage />;

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Breadcrumbs */}
      <nav className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-2 text-sm text-slate-500">
        <span>Home</span> <ChevronRight size={14} />
        <span>{product.category}</span> <ChevronRight size={14} />
        <span className="text-slate-900 font-medium truncate">
          {product.title}
        </span>
      </nav>

      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* LEFT: Image Gallery (Span 7) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
            <img
              src={activeImg}
              alt={product.title}
              className="w-full h-full object-center object-contain hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(img)}
                className={`flex-shrink-0 w-24 h-24 rounded-xl border-2 transition-all ${
                  activeImg === img
                    ? "border-pink-500 scale-95"
                    : "border-transparent opacity-70 hover:opacity-100"
                }`}
              >
                <img
                  src={img}
                  className="w-full h-full object-cover rounded-lg"
                  alt="thumbnail"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: Product Info (Span 5) */}
        <div className="lg:col-span-5 flex flex-col">
          <div className="mb-2">
            <span className="text-pink-600 font-bold text-sm uppercase tracking-widest">
              {product.brand}
            </span>
            <h1 className="text-4xl font-extrabold text-slate-900 mt-1 leading-tight">
              {product.title}
            </h1>
          </div>

          <div className="flex items-center gap-4 my-4">
            <div className="flex items-center bg-amber-50 px-2 py-1 rounded-md">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              <span className="ml-1 text-sm font-bold text-amber-900">
                {product.rating || "4.8"}
              </span>
            </div>
            <span className="text-sm text-slate-400 font-medium border-l pl-4">
              120+ Reviews
            </span>
          </div>

          <div className="flex items-baseline gap-4 mb-6">
            <span className="text-4xl font-black text-slate-900">
              ₹{product.price.toLocaleString()}
            </span>
            <span className="text-xl text-slate-400 line-through">
              ₹{product.mrp.toLocaleString()}
            </span>
            <span className="text-green-600 font-bold bg-green-50 px-3 py-1 rounded-full text-sm">
              {Math.round(((product.mrp - product.price) / product.mrp) * 100)}%
              OFF
            </span>
          </div>

          <div className="space-y-4 mb-8">
            <button
              onClick={() => addToCart(product)}
              className="w-full bg-slate-900 text-white flex items-center justify-center gap-3 py-5 rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all active:scale-[0.98] shadow-xl shadow-slate-200"
            >
              <ShoppingCart size={22} />
              Add to Shopping Cart
            </button>
          </div>

          {/* Trust Badges */}
          <div className="grid grid-cols-3 gap-2 py-6 border-t border-slate-100">
            <div className="flex flex-col items-center text-center p-2">
              <Truck size={20} className="text-slate-600 mb-2" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Free Delivery
              </span>
            </div>
            <div className="flex flex-col items-center text-center p-2 border-x border-slate-100">
              <RotateCcw size={20} className="text-slate-600 mb-2" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                7 Day Return
              </span>
            </div>
            <div className="flex flex-col items-center text-center p-2">
              <ShieldCheck size={20} className="text-slate-600 mb-2" />
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                1 Year Warranty
              </span>
            </div>
          </div>

          {/* Collapsible Details (Simplified) */}
          <div className="space-y-6 mt-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">
                Product Description
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm">
                {product.description}
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl">
              <h3 className="text-sm font-bold text-slate-900 mb-4 uppercase tracking-wider">
                Specifications
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-8 text-sm">
                <div className="flex flex-col border-b border-slate-200 pb-2">
                  <span className="text-slate-400 text-xs">Material</span>
                  <span className="text-slate-700 font-medium">
                    {product.specifications?.material || "Premium Quality"}
                  </span>
                </div>
                <div className="flex flex-col border-b border-slate-200 pb-2">
                  <span className="text-slate-400 text-xs">Weight</span>
                  <span className="text-slate-700 font-medium">
                    {product.specifications?.weight || "0.5kg"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

// Sub-components for better organization
const DetailSkeleton = () => (
  <div className="max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-2 gap-10 animate-pulse">
    <div className="aspect-square bg-slate-200 rounded-2xl" />
    <div className="space-y-6">
      <div className="h-10 bg-slate-200 w-3/4 rounded" />
      <div className="h-6 bg-slate-200 w-1/4 rounded" />
      <div className="h-20 bg-slate-200 w-full rounded" />
      <div className="h-16 bg-slate-200 w-full rounded-2xl" />
    </div>
  </div>
);

const ErrorMessage = () => (
  <div className="h-96 flex flex-col items-center justify-center text-slate-500">
    <h2 className="text-2xl font-bold">Product not found</h2>
    <p>It might have been removed or the link is broken.</p>
  </div>
);

export default ProductDetail;
