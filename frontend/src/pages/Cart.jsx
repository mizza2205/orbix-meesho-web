import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  ShieldCheck,
  Truck,
} from "lucide-react";

const API_URL = "http://localhost:9000/api/cart";
const USER_ID = "12345"; // Replace with your actual Auth logic

function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchCart = async () => {
    try {
      const res = await axios.get(`${API_URL}/${USER_ID}`);
      setCartItems(res.data.cart?.items || []);
      setTotal(res.data.total || 0);
    } catch (err) {
      console.error("Error fetching cart:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await axios.put(`${API_URL}/update`, {
        userId: USER_ID,
        productId,
        quantity: newQuantity,
      });
      fetchCart();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  const handleRemove = async (productId) => {
    try {
      await axios.delete(`${API_URL}/remove`, {
        data: { userId: USER_ID, productId },
      });
      fetchCart();
    } catch (err) {
      console.error("Remove failed", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-600"></div>
          <p className="text-gray-500 font-medium animate-pulse">
            Securing your bag...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumbs / Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-black text-gray-900 tracking-tight">
            MY BAG
          </h1>
          <p className="text-gray-500 mt-2 font-medium">
            Items in your cart are not reserved — check out now to make them
            yours.
          </p>
        </div>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 p-16 text-center max-w-2xl mx-auto">
            <div className="bg-pink-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8">
              <ShoppingBag className="text-pink-500 w-12 h-12" />
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Your bag is empty
            </h2>
            <p className="text-gray-500 text-lg mb-10">
              Looks like you haven't made your choice yet. Let's find something
              special.
            </p>
            <Link
              to="/"
              className="inline-block bg-gray-900 text-white px-10 py-4 rounded-full font-bold hover:bg-black transition-all transform hover:-translate-y-1"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            {/* Left Side: Product List */}
            <div className="lg:col-span-8 space-y-6">
              {cartItems.map((item) => (
                <div
                  key={item.productId._id}
                  className="group relative bg-white p-6 rounded-3xl border border-gray-100 hover:border-pink-200 transition-all shadow-sm hover:shadow-xl hover:shadow-pink-50/50 flex flex-col sm:flex-row gap-8"
                >
                  {/* Image Container */}
                  <div className="h-40 w-40 sm:h-48 sm:w-48 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-50 relative">
                    <img
                      src={
                        item.productId.images?.[0] ||
                        "https://via.placeholder.com/300"
                      }
                      alt={item.productId.title}
                      className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>

                  {/* Info Container */}
                  <div className="flex flex-1 flex-col justify-between py-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="text-xs font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-2 py-1 rounded mb-2 inline-block">
                          {item.productId.brand || "Luxury Store"}
                        </span>
                        <h3 className="text-xl font-bold text-gray-900 leading-tight pr-4">
                          {item.productId.title}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1 italic">
                          SKU: {item.productId._id.slice(-6)}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(item.productId._id)}
                        className="text-gray-300 hover:text-red-500 transition-all p-2 hover:bg-red-50 rounded-full"
                      >
                        <Trash2 size={22} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between mt-6 gap-4">
                      {/* Quantity Pill */}
                      <div className="flex items-center border-2 border-gray-100 rounded-2xl bg-white p-1.5 shadow-inner">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId._id,
                              item.quantity - 1,
                            )
                          }
                          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all text-gray-400"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-12 text-center font-black text-gray-800 text-lg">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.productId._id,
                              item.quantity + 1,
                            )
                          }
                          className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-900 hover:text-white transition-all text-gray-400"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      {/* Pricing */}
                      <div className="text-right">
                        <p className="text-xs font-bold text-gray-400 line-through">
                          ₹{item.productId.mrp || item.productId.price + 500}
                        </p>
                        <p className="text-2xl font-black text-gray-900">
                          ₹{item.productId.price * item.quantity}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <Link
                to="/"
                className="inline-flex items-center gap-3 text-sm font-bold text-gray-400 hover:text-pink-600 transition-colors py-4"
              >
                <ArrowLeft size={18} /> BACK TO STORE
              </Link>
            </div>

            {/* Right Side: Sidebar */}
            <div className="lg:col-span-4 sticky top-10">
              <div className="bg-white rounded-[2rem] shadow-2xl shadow-gray-200/50 border border-gray-100 p-8">
                <h2 className="text-xl font-black text-gray-900 mb-8 border-b pb-4">
                  Order Summary
                </h2>

                <div className="space-y-5 mb-10">
                  <div className="flex justify-between text-gray-500 font-medium text-lg">
                    <span>Subtotal</span>
                    <span className="text-gray-900">₹{total}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 font-medium text-lg">
                    <span className="flex items-center gap-2">
                      Shipping <Truck size={18} className="text-pink-400" />
                    </span>
                    <span className="text-green-600 font-bold">FREE</span>
                  </div>
                  <div className="pt-6 border-t border-gray-100 flex justify-between items-center">
                    <span className="text-xl font-bold text-gray-900">
                      Total
                    </span>
                    <div className="text-right">
                      <span className="text-3xl font-black text-gray-900">
                        ₹{total}
                      </span>
                      <p className="text-xs text-green-600 font-bold tracking-tighter">
                        INCLUDING TAXES & DUTIES
                      </p>
                    </div>
                  </div>
                </div>

                <Link to="/checkout">
                  <button className="w-full bg-pink-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-pink-700 transition-all shadow-xl shadow-pink-200 active:scale-95 mb-6">
                    CHECKOUT
                  </button>
                </Link>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-xs text-gray-400 font-bold bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <ShieldCheck className="text-green-500" size={20} />
                    <span>SECURE SSL ENCRYPTED PAYMENT SYSTEM</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
