import { useState, useMemo } from "react";
import { addProduct } from "../../api/productApi";
import {
  Package,
  Image as ImageIcon,
  Settings,
  Layers,
  Plus,
  Trash2,
  Loader2,
  CheckCircle2,
} from "lucide-react"; // npm install lucide-react

import {useNavigate} from "react-router-dom"
const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    mrp: "",
    category: "",
    brand: "",
    images: "",
    specifications: { material: "", color: "", weight: "" },
    variants: [{ size: "", color: "", stock: 0 }],
  });

  // Derived State: Auto-calculate discount percentage for the UI
  const discountPercentage = useMemo(() => {
    if (!formData.price || !formData.mrp) return 0;
    const diff = formData.mrp - formData.price;
    return Math.round((diff / formData.mrp) * 100);
  }, [formData.price, formData.mrp]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      specifications: { ...prev.specifications, [name]: value },
    }));
  };

  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const newVariants = [...formData.variants];
    newVariants[index][name] = value;
    setFormData((prev) => ({ ...prev, variants: newVariants }));
  };

  const addVariantField = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", color: "", stock: 0 }],
    }));
  };

  const removeVariant = (index) => {
    const filtered = formData.variants.filter((_, i) => i !== index);
    setFormData((prev) => ({ ...prev, variants: filtered }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const submissionData = {
        ...formData,
        price: Number(formData.price),
        mrp: Number(formData.mrp),
        images: formData.images
          .split(",")
          .map((url) => url.trim())
          .filter((url) => url !== ""),
        discount: formData.mrp - formData.price,
      };
      
      await addProduct(submissionData);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000); 
      navigate('/')
    } catch (err) {
      alert("Backend Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">
              Create Product
            </h1>
            <p className="text-slate-500">
              Manage your inventory and product details
            </p>
          </div>
          {success && (
            <div className="flex items-center gap-2 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg animate-bounce">
              <CheckCircle2 size={20} /> Product Published!
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Content Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b pb-4">
                <Package size={20} className="text-blue-600" /> General
                Information
              </div>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Product Title
                  </label>
                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g. Nike Air Max 270"
                    className="w-full border-slate-200 rounded-xl p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none border transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700">
                    Description
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    onChange={handleChange}
                    className="w-full border-slate-200 rounded-xl p-3 mt-1 focus:ring-2 focus:ring-blue-500 outline-none border transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Inventory & Variants Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <div className="flex items-center gap-2 text-slate-800 font-semibold">
                  <Layers size={20} className="text-blue-600" /> Variants &
                  Stock
                </div>
                <button
                  type="button"
                  onClick={addVariantField}
                  className="text-sm text-blue-600 font-medium flex items-center gap-1 hover:bg-blue-50 px-3 py-1 rounded-lg transition-colors"
                >
                  <Plus size={16} /> Add Variant
                </button>
              </div>
              <div className="space-y-3">
                {formData.variants.map((variant, index) => (
                  <div
                    key={index}
                    className="flex flex-wrap md:flex-nowrap gap-3 items-end p-4 bg-slate-50 rounded-xl border border-slate-100"
                  >
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">
                        Size
                      </label>
                      <input
                        name="size"
                        placeholder="XL"
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full bg-white border-slate-200 rounded-lg p-2 border"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">
                        Color
                      </label>
                      <input
                        name="color"
                        placeholder="Red"
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full bg-white border-slate-200 rounded-lg p-2 border"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">
                        Stock
                      </label>
                      <input
                        name="stock"
                        type="number"
                        placeholder="10"
                        onChange={(e) => handleVariantChange(index, e)}
                        className="w-full bg-white border-slate-200 rounded-lg p-2 border"
                      />
                    </div>
                    {formData.variants.length > 1 && (
                      <button
                        onClick={() => removeVariant(index)}
                        className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <Trash2 size={20} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="space-y-6">
            {/* Pricing Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b pb-4">
                <Settings size={20} className="text-blue-600" /> Pricing
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      MRP
                    </label>
                    <input
                      type="number"
                      name="mrp"
                      onChange={handleChange}
                      className="w-full border-slate-200 rounded-xl p-3 mt-1 border"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700">
                      Price
                    </label>
                    <input
                      type="number"
                      name="price"
                      onChange={handleChange}
                      className="w-full border-slate-200 rounded-xl p-3 mt-1 border"
                    />
                  </div>
                </div>
                {discountPercentage > 0 && (
                  <div className="bg-green-50 text-green-700 p-3 rounded-xl text-center text-sm font-bold border border-green-100 italic">
                    Saving {discountPercentage}% for customers!
                  </div>
                )}
              </div>
            </div>

            {/* Media/Images Card */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-6 text-slate-800 font-semibold border-b pb-4">
                <ImageIcon size={20} className="text-blue-600" /> Product Images
              </div>
              <textarea
                name="images"
                onChange={handleChange}
                placeholder="Paste Image URLs separated by commas"
                className="w-full border-slate-200 rounded-xl p-3 mt-1 h-24 border text-xs"
              />
              {/* Preview Logic */}
              <div className="flex flex-wrap gap-2 mt-4">
                {formData.images
                  .split(",")
                  .slice(0, 3)
                  .map(
                    (url, i) =>
                      url.trim() && (
                        <img
                          key={i}
                          src={url.trim()}
                          alt="preview"
                          className="w-12 h-12 object-cover rounded-lg border border-slate-100 shadow-sm"
                        />
                      ),
                  )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              disabled={loading}
              className={`w-full py-4 rounded-2xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${
                loading
                  ? "bg-slate-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Publish Product"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
