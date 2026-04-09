import { Link, useLocation } from "react-router-dom";
import { useCart } from "../context/CartContext"; // Import the hook

function Navbar() {
  const { cartCount } = useCart(); // Get real-time count
  const location = useLocation();

  // Helper to highlight active link
  const activeStyle = (path) => 
    location.pathname === path 
      ? "bg-blue-600 text-white shadow-lg" 
      : "bg-gray-100 text-gray-700 hover:bg-blue-500 hover:text-white";

  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      {/* Logo */}
      <Link to="/" className="text-2xl font-black tracking-tighter text-blue-600">
        O<span className="text-gray-800">rbix</span>
      </Link>

      {/* Menu */}
      <div className="flex items-center gap-3">
        <Link to="/">
          <button className={`px-4 py-2 rounded-lg font-medium transition ${activeStyle("/")}`}>
            Home
          </button>
        </Link>

        <Link to="/cart" className="relative group">
          <button className={`px-4 py-2 rounded-lg font-medium transition ${activeStyle("/cart")}`}>
            Cart
          </button>
          {/* Real-time Badge */}
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full border-2 border-white animate-bounce">
              {cartCount}
            </span>
          )}
        </Link>

        <div className="h-6 w-[1px] bg-gray-300 mx-2"></div>

        <Link to="/admin/add">
          <button className={`px-4 py-2 rounded-lg font-medium transition ${activeStyle("/admin/add")}`}>
            Add Product
          </button>
        </Link>

        <Link to="/admin/orders">
          <button className={`px-4 py-2 rounded-lg font-medium transition ${activeStyle("/admin/orders")}`}>
            Orders
          </button>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;