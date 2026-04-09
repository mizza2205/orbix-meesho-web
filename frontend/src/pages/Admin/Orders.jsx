import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  Package,
  MapPin,
  User,
  Search,
  CreditCard,
  Clock,
  CheckCircle2,
  Truck,
  XCircle,
  ChevronRight,
  Filter,
} from "lucide-react";

const ORDERS_API = "http://localhost:9000/api/orders";
const PRODUCTS_API = "http://localhost:9000/api/products";

// Utility for status colors - centralized configuration
const STATUS_CONFIG = {
  pending: {
    color: "bg-amber-100 text-amber-700 border-amber-200",
    icon: Clock,
  },
  shipped: { color: "bg-blue-100 text-blue-700 border-blue-200", icon: Truck },
  delivered: {
    color: "bg-emerald-100 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    color: "bg-rose-100 text-rose-700 border-rose-200",
    icon: XCircle,
  },
};

function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const loadData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.get(ORDERS_API),
          axios.get(PRODUCTS_API),
        ]);
        setOrders(ordersRes.data);
        setProducts(productsRes.data.products);
      } catch (err) {
        console.error("Data Sync Error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const productLookup = useMemo(() => {
    return products.reduce((acc, p) => ({ ...acc, [p._id]: p }), {});
  }, [products]);

  // Filter logic: Search + Status Tabs
  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      const matchesSearch = o._id
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesTab = activeTab === "all" || o.status === activeTab;
      return matchesSearch && matchesTab;
    });
  }, [orders, searchTerm, activeTab]);

  const updateStatus = async (orderId, newStatus) => {
    const originalOrders = [...orders];
    // Optimistic Update: Change UI immediately
    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, status: newStatus } : o)),
    );

    try {
      await axios.put(`${ORDERS_API}/${orderId}`, { status: newStatus });
    } catch (err) {
      setOrders(originalOrders); // Rollback on failure
      alert("System failed to sync status. Reverting...");
    }
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="min-h-screen bg-slate-50/50 py-8 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Production Header */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Order Management
              </h1>
              <p className="text-slate-500 font-medium">
                Monitoring {orders.length} transactions across the platform
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search Order ID..."
                  className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm focus:ring-2 focus:ring-pink-500 outline-none transition-all"
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Status Tabs */}
          <div className="flex items-center gap-2 mt-8 overflow-x-auto pb-2 scrollbar-hide">
            {["all", "pending", "shipped", "delivered", "cancelled"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-5 py-2 rounded-full text-sm font-bold capitalize transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-slate-900 text-white shadow-lg shadow-slate-200"
                      : "bg-white text-slate-500 border border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </div>
        </header>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => {
              const StatusIcon = STATUS_CONFIG[order.status]?.icon || Clock;

              return (
                <div
                  key={order._id}
                  className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {/* Compact Header */}
                  <div className="px-6 py-4 border-b border-slate-50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-2 bg-slate-100 rounded-lg">
                        <Package size={20} className="text-slate-600" />
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                          Order ID
                        </p>
                        <p className="text-sm font-bold text-slate-900 font-mono">
                          #{order._id.slice(-8).toUpperCase()}
                        </p>
                      </div>
                    </div>

                    <div
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-bold capitalize ${STATUS_CONFIG[order.status]?.color}`}
                    >
                      <StatusIcon size={14} />
                      {order.status}
                    </div>
                  </div>

                  {/* Content Grid */}
                  <div className="p-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Item Manifest */}
                    <div className="lg:col-span-4 space-y-3">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Filter size={12} /> Items Details
                      </h4>
                      {order.items.map((item, idx) => {
                        const product = productLookup[item.productId];
                        return (
                          <div
                            key={idx}
                            className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100"
                          >
                            <img
                              src={
                                product?.images?.[0] ||
                                "https://via.placeholder.com/50"
                              }
                              className="w-12 h-12 rounded-lg object-cover bg-white"
                              alt=""
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-bold text-slate-800 truncate">
                                {product?.title || "Unknown Product"}
                              </p>
                              <p className="text-xs font-semibold text-slate-400">
                                Qty: {item.quantity} • {product?.brand}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Customer Info */}
                    <div className="lg:col-span-4 space-y-4">
                      <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <User size={12} /> Logistics Info
                      </h4>
                      <div className="p-4 rounded-2xl bg-white border border-slate-100">
                        <p className="text-sm font-bold text-slate-900 mb-1">
                          {order.address?.name || "Regular Customer"}
                        </p>
                        <p className="text-xs text-slate-500 font-medium leading-relaxed mb-3">
                          {typeof order.address === "object"
                            ? order.address.address
                            : order.address}
                        </p>
                        <div className="flex items-center gap-2 text-pink-600 font-bold text-xs bg-pink-50 w-fit px-2 py-1 rounded">
                          <MapPin size={12} />{" "}
                          {order.address?.phone || "No Phone"}
                        </div>
                      </div>
                    </div>

                    {/* Settlement & Actions */}
                    <div className="lg:col-span-4 flex flex-col justify-between gap-6">
                      <div className="flex items-end justify-between lg:justify-start lg:flex-col lg:items-start gap-1">
                        <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
                          Total Settlement
                        </p>
                        <p className="text-3xl font-black text-slate-900 tracking-tighter">
                          ₹{order.totalAmount.toLocaleString()}
                        </p>
                      </div>

                      <div className="space-y-3">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Workflow Actions
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {Object.keys(STATUS_CONFIG).map((s) => (
                            <button
                              key={s}
                              onClick={() => updateStatus(order._id, s)}
                              className={`px-3 py-2 rounded-xl text-[10px] font-bold uppercase transition-all flex-1 border
                                ${
                                  order.status === s
                                    ? "bg-slate-900 border-slate-900 text-white"
                                    : "bg-white border-slate-200 text-slate-500 hover:border-pink-300 hover:bg-pink-50 hover:text-pink-600"
                                }
                              `}
                            >
                              {s}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="bg-white p-20 rounded-[3rem] text-center border-2 border-dashed border-slate-200">
              <ShoppingBag className="mx-auto text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 font-bold">
                No orders found matching your filters.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Senior Move: Reusable Loading Shimmer
const AdminSkeleton = () => (
  <div className="p-12 max-w-7xl mx-auto space-y-8 animate-pulse">
    <div className="h-10 bg-slate-200 w-1/4 rounded-lg" />
    <div className="flex gap-4">
      <div className="h-8 bg-slate-200 w-20 rounded-full" />
      <div className="h-8 bg-slate-200 w-20 rounded-full" />
    </div>
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-64 bg-slate-200 rounded-[2.5rem]" />
    ))}
  </div>
);

export default AdminOrders;
