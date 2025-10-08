import mongoose from "mongoose";

//  Connect to MongoDB
await mongoose.connect("mongodb://127.0.0.1:27017/ecommerceDB");
console.log("✅ Connected to MongoDB");

//  Define Schema and Model
const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  stock: Number
});

const productSchema = new mongoose.Schema({
  name: String,
  price: Number,
  category: String,
  variants: [variantSchema]
});

const Product = mongoose.model("Product", productSchema);

//  Insert sample products
await Product.insertMany([
  {
    name: "T-Shirt",
    price: 499,
    category: "Clothing",
    variants: [
      { color: "Red", size: "M", stock: 50 },
      { color: "Blue", size: "L", stock: 20 }
    ]
  },
  {
    name: "Sneakers",
    price: 2499,
    category: "Footwear",
    variants: [
      { color: "Black", size: "9", stock: 15 },
      { color: "White", size: "10", stock: 25 }
    ]
  }
]);

console.log("✅ Sample products inserted!");

//  Get all products
const allProducts = await Product.find();
console.log("\nAll Products:");
console.log(allProducts);

//  Filter products by category
const clothing = await Product.find({ category: "Clothing" });
console.log("\nClothing Products:");
console.log(clothing);

//  Show only name + variants
const projection = await Product.find({}, { name: 1, variants: 1, _id: 0 });
console.log("\nProduct Names and Variants:");
console.log(projection);

//  Update stock of a variant
await Product.updateOne(
  { name: "T-Shirt", "variants.color": "Blue" },
  { $set: { "variants.$.stock": 10 } }
);
console.log("\nStock updated for T-Shirt (Blue)");

//  Delete a product
await Product.deleteOne({ name: "Sneakers" });
console.log("\nDeleted 'Sneakers' product!");

//  Close connection
await mongoose.disconnect();
console.log("\n✅ All done!");
