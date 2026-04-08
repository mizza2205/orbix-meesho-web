function AddProduct() {
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Add Product</h1>

      <input
        className="border p-2 block w-full mt-2"
        placeholder="Product Name"
      />
      <input className="border p-2 block w-full mt-2" placeholder="Price" />
      <input className="border p-2 block w-full mt-2" placeholder="Image URL" />

      <button className="bg-blue-500 text-white px-4 py-2 mt-4">
        Add Product
      </button>
    </div>
  );
}

export default AddProduct;
