import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function CreateProduct() {
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    image: "",
  });

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("quantity", form.quantity);
      formData.append("image", form.image);

      await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product created!");
      navigate("/products");
    } catch (err) {
      alert("Failed to create product");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 bg-white p-6 rounded shadow">
      <h1 className="text-2xl font-bold text-accent mb-4">Add New Product</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Product Name"
          className="w-full p-2 border rounded mb-2"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          type="number"
          placeholder="Price in ₹"
          className="w-full p-2 border rounded mb-2"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />
        <input
          type="number"
          placeholder="Quantity"
          className="w-full p-2 border rounded mb-2"
          value={form.quantity}
          onChange={(e) => setForm({ ...form, quantity: e.target.value })}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
          className="w-full p-2 border rounded mb-4"
        />

        <button
          type="submit"
          className="w-full bg-accent text-black py-2 rounded"
        >
          Create Product
        </button>
      </form>
    </div>
  );
}
