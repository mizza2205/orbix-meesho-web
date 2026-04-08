import Product from "../models/product.model.js";

// ✅ GET ALL PRODUCTS (FILTER + SEARCH + SORT + PAGINATION)
export const getProducts = async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      rating,
      search,
      sort,
      page = 1,
      limit = 10
    } = req.query;

    let filter = {};

    if (category) filter.category = category;
    if (rating) filter.rating = { $gte: Number(rating) };

    if (minPrice && maxPrice) {
      filter.price = {
        $gte: Number(minPrice),
        $lte: Number(maxPrice)
      };
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    let query = Product.find(filter);

    // SORT
    if (sort === "low") query = query.sort({ price: 1 });
    if (sort === "high") query = query.sort({ price: -1 });
    if (sort === "new") query = query.sort({ createdAt: -1 });

    // PAGINATION
    const skip = (page - 1) * limit;
    query = query.skip(skip).limit(Number(limit));

    const products = await query;
    const total = await Product.countDocuments(filter);

    res.json({
      total,
      page: Number(page),
      products
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ GET SINGLE PRODUCT
export const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ ADD PRODUCT (ADMIN)
export const addProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ UPDATE PRODUCT
export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(product);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ✅ DELETE PRODUCT
export const deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};