import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

function OrderSuccess() {
  return (
    <div className="h-screen w-full flex flex-col items-center justify-center bg-white relative overflow-hidden">
      <Confetti recycle={false} numberOfPieces={400} />
      
      <motion.div 
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        className="bg-green-100 p-8 rounded-full mb-8"
      >
        <CheckCircle size={100} className="text-green-600" />
      </motion.div>

      <motion.h1 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="text-5xl font-black text-gray-900 mb-2"
      >
        Order Confirmed!
      </motion.h1>
      
      <p className="text-gray-500 font-medium mb-10 text-lg">Check your email for order details and tracking.</p>

      <div className="flex gap-4">
        <Link to="/admin/orders" className="bg-gray-900 text-white px-10 py-4 rounded-full font-bold hover:bg-black flex items-center gap-2 transition-all">
          My Orders <ArrowRight size={18}/>
        </Link>
      </div>
    </div>
  );
}

export default OrderSuccess;