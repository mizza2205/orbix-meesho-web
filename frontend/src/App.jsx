import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Address from "./pages/Address";
import OrderSuccess from "./pages/OrderSuccess";
import AddProduct from "./pages/Admin/AddProduct";
import Orders from "./pages/Admin/Orders";
import Checkout from "./pages/Checkout";
import { CartProvider } from "./context/CartContext";


function App() {
  return (


    <CartProvider>

    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/address" element={<Address />} />
        <Route path="/order-success" element={<OrderSuccess />} />

        {/* Admin */}
        <Route path="/admin/add" element={<AddProduct />} />
        <Route path="/admin/orders" element={<Orders />} />
      </Routes>
    </BrowserRouter>
    </CartProvider>

  );
}

export default App;