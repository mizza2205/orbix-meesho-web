import { useNavigate } from "react-router-dom";

function Address() {
  const navigate = useNavigate();

  const handlePlaceOrder = () => {
    navigate("/order-success");
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Enter Address</h1>

      <input className="border p-2 w-full mt-2" placeholder="Name" />
      <input className="border p-2 w-full mt-2" placeholder="Address" />
      <input className="border p-2 w-full mt-2" placeholder="Phone" />

      <button
        onClick={handlePlaceOrder}
        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 mt-4 w-full rounded"
      >
        Place Order
      </button>
    </div>
  );
}

export default Address;
