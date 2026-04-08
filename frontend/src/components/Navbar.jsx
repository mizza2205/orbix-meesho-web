import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      {/* Logo */}
      <h1 className="text-2xl font-bold text-blue-600">MyShop</h1>

      {/* Menu */}
      <div className="flex gap-4">
        <Link to="/">
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-blue-500 hover:text-white transition">
            Home
          </button>
        </Link>

        <Link to="/cart">
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-blue-500 hover:text-white transition">
            Cart
          </button>
        </Link>

        <Link to="/admin/orders">
          <button className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-blue-500 hover:text-white transition">
            Admin
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Navbar;
