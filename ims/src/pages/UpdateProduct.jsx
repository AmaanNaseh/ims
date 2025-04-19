import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";

export default function UpdateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    price: "",
    quantity: "",
    image: null, // file
  });

  const [preview, setPreview] = useState(null); // image preview

  useEffect(() => {
    API.get(`/products/${id}`).then((res) => {
      setForm({
        name: res.data.name,
        price: res.data.price,
        quantity: res.data.quantity,
        image: null, // we reset to null because we're not editing buffer image directly
      });

      // Setup preview if existing image exists
      if (res.data.image?.data) {
        const base64Image = btoa(
          new Uint8Array(res.data.image.data.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        setPreview(`data:${res.data.image.contentType};base64,${base64Image}`);
      }
    });
  }, [id]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      // Only add the fields that were changed
      if (form.name !== "") formData.append("name", form.name);
      if (form.price !== "") formData.append("price", form.price);
      if (form.quantity !== "") formData.append("quantity", form.quantity);
      if (form.image) formData.append("image", form.image); // only if new image selected

      await API.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Product updated!");
      navigate("/products");
    } catch (err) {
      alert("Failed to update product");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl mb-4 font-semibold text-accent">
        Update Product
      </h1>

      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Name"
        value={form.name}
        onChange={(e) => setForm({ ...form, name: e.target.value })}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Price"
        value={form.price}
        onChange={(e) => setForm({ ...form, price: e.target.value })}
      />
      <input
        className="w-full mb-2 p-2 border rounded"
        placeholder="Quantity"
        value={form.quantity}
        onChange={(e) => setForm({ ...form, quantity: e.target.value })}
      />

      {/* Image Upload */}
      <input
        type="file"
        accept="image/*"
        className="w-full mb-2 p-2 border rounded"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            setForm({ ...form, image: file });
            setPreview(URL.createObjectURL(file));
          }
        }}
      />

      {preview && (
        <img
          src={preview}
          alt="preview"
          className="w-full h-40 object-cover rounded mb-3"
        />
      )}

      <button
        onClick={handleUpdate}
        className="bg-accent text-black w-full py-2 rounded mt-3"
      >
        Update
      </button>
    </div>
  );
}
