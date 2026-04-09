import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { MapPin, ShieldCheck, CreditCard, User, Phone } from "lucide-react";

const API_URL = "http://localhost:9000/api";
const USER_ID = "12345"; // In production, get this from your Auth context

function Checkout() {
  const navigate = useNavigate();

  // Updated state to match your Order Schema address object
  const [shippingInfo, setShippingInfo] = useState({
    name: "",
    street: "",
    city: "",
    zip: "",
    phone: "",
  });

  const [total, setTotal] = useState(0);

  useEffect(() => {
    // Fetch total from cart
    axios
      .get(`${API_URL}/cart/${USER_ID}`)
      .then((res) => setTotal(res.data.total))
      .catch((err) => console.error("Error fetching total", err));
  }, []);

  const handlePayment = async () => {
    // Validation: Ensure all fields required by your schema/UI are filled
    if (!shippingInfo.name || !shippingInfo.street || !shippingInfo.phone) {
      return alert(
        "Please fill in your name, street address, and phone number.",
      );
    }

    try {
      // 1. Create Razorpay order on backend
      const { data: order } = await axios.post(
        `${API_URL}/payment/create-order`,
        {
          amount: total,
        },
      );

      // 2. Configure Razorpay Options
      const options = {
        key: "rzp_test_SbNllmq0OGnTWT",
        amount: order.amount,
        currency: "INR",
        name: "Orbix",
        description: "Order Checkout",
        order_id: order.id,
        handler: async (response) => {
          // 3. Prepare data exactly as per your Order Schema
          const finalOrderData = {
            userId: USER_ID,
            totalAmount: total,
            address: {
              name: shippingInfo.name,
              address: `${shippingInfo.street}, ${shippingInfo.city} - ${shippingInfo.zip}`,
              phone: shippingInfo.phone,
            },
            paymentId: response.razorpay_payment_id, // Sent for verification
            razorpayOrderId: response.razorpay_order_id,
            signature: response.razorpay_signature,
          };

          try {
            // This endpoint should: 1. Verify Payment, 2. Get Cart Items, 3. Save Order, 4. Clear Cart
            await axios.post(`${API_URL}/orders/checkout`, finalOrderData);
            navigate("/order-success");
          } catch (error) {
            console.error("Order finalization failed", error);
            alert(
              "Payment successful, but order saving failed. Please contact support.",
            );
          }
        },
        prefill: {
          name: shippingInfo.name,
          contact: shippingInfo.phone,
        },
        theme: { color: "#db2777" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error("Payment initialization failed", err);
      alert("Could not initiate payment. Check console.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Side: Address Form */}
        <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
          <h2 className="text-2xl font-black mb-6 flex items-center gap-2">
            <MapPin className="text-pink-600" /> Shipping Details
          </h2>

          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-4 top-4 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, name: e.target.value })
                }
              />
            </div>

            <input
              type="text"
              placeholder="Street Address / House No."
              className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition-all"
              onChange={(e) =>
                setShippingInfo({ ...shippingInfo, street: e.target.value })
              }
            />

            <div className="flex gap-4">
              <input
                type="text"
                placeholder="City"
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, city: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="ZIP Code"
                className="w-full p-4 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, zip: e.target.value })
                }
              />
            </div>

            <div className="relative">
              <Phone
                className="absolute left-4 top-4 text-gray-400"
                size={18}
              />
              <input
                type="text"
                placeholder="Phone Number"
                className="w-full p-4 pl-12 bg-gray-50 rounded-2xl outline-none focus:ring-2 focus:ring-pink-500 transition-all"
                onChange={(e) =>
                  setShippingInfo({ ...shippingInfo, phone: e.target.value })
                }
              />
            </div>
          </div>
        </div>

        {/* Right Side: Summary & Payment */}
        <div className="bg-gray-900 text-white p-8 rounded-[2rem] shadow-2xl flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-black mb-8 border-b border-gray-800 pb-4">
              Order Summary
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Shipping</span>
                <span className="text-green-500 uppercase text-xs font-bold">
                  Free
                </span>
              </div>
              <div className="flex justify-between text-3xl font-black text-pink-500 mt-6 pt-4 border-t border-gray-800">
                <span>Total</span>
                <span>₹{total}</span>
              </div>
            </div>
          </div>

          <div className="mt-12 space-y-4">
            <button
              onClick={handlePayment}
              className="w-full bg-pink-600 hover:bg-pink-700 py-5 rounded-2xl font-black text-xl flex items-center justify-center gap-3 transition-all active:scale-95 shadow-lg shadow-pink-900/20"
            >
              <CreditCard /> Pay Securely
            </button>
            <div className="flex items-center gap-2 text-[10px] text-gray-500 justify-center uppercase tracking-widest font-bold">
              <ShieldCheck size={14} className="text-green-500" /> Verified
              Secure Checkout
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
