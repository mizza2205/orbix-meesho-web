import { Link } from "react-router-dom";

function Cart() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Cart</h1>

      <div className="border p-4 mt-4">
        <p>Fancy Men Analog Watch</p>
        <p>₹180</p>
      </div>

      <Link to="/address">
        <button className="bg-blue-500 text-white px-4 py-2 mt-4">
          Checkout
        </button>
      </Link>
    </div>
  );
}

export default Cart;
