import { useState } from "react";
import { checkout } from "../api/orderAPI";
import { useNavigate } from "react-router-dom";

function Address() {
  const [form, setForm] = useState({});
  const navigate = useNavigate();

  const handleOrder = () => {
    checkout(form).then(() => {
      navigate("/order-success");
    });
  };

  return (
    <div className="p-6">
      <input
        placeholder="Name"
        className="border p-2 w-full mt-2"
        onChange={e => setForm({ ...form, name: e.target.value })}
      />
      <input
        placeholder="Address"
        className="border p-2 w-full mt-2"
        onChange={e => setForm({ ...form, address: e.target.value })}
      />
      <input
        placeholder="Phone"
        className="border p-2 w-full mt-2"
        onChange={e => setForm({ ...form, phone: e.target.value })}
      />

      <button
        onClick={handleOrder}
        className="bg-green-500 text-white px-4 py-2 mt-4 w-full"
      >
        Place Order
      </button>
    </div>
  );
}

export default Address;