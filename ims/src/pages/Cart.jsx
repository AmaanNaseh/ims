import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchCart = async () => {
      if (!user) return;

      try {
        const res = await axios.get(
          `http://localhost:5000/api/cart/${user._id}`
        );
        setCartItems(res.data.products || []);
      } catch (err) {
        console.error(
          "Error fetching cart:",
          err?.response?.data || err.message
        );
        setCartItems([]);
      }
    };

    fetchCart();
  }, [user]);

  const handleConfirm = async (item) => {
    try {
      const token = localStorage.getItem("token"); // Assuming you store JWT in localStorage

      await axios.post(
        "http://localhost:5000/api/orders/book",
        {
          productId:
            typeof item.productId === "object"
              ? item.productId._id
              : item.productId,
          quantity: item.quantity,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update cart after confirming order
      setCartItems(
        cartItems.filter(
          (i) =>
            (typeof i.productId === "object"
              ? i.productId._id
              : i.productId) !==
            (typeof item.productId === "object"
              ? item.productId._id
              : item.productId)
        )
      );
      alert("Order confirmed!");
    } catch (err) {
      console.error(
        "Error confirming order:",
        err?.response?.data || err.message
      );
      alert("Failed to confirm order.");
    }
  };

  const handleReject = async (item) => {
    try {
      const productId =
        typeof item.productId === "object"
          ? item.productId._id
          : item.productId;

      // Call the backend to reject the item and remove it from the cart
      await axios.post("http://localhost:5000/api/cart/reject", {
        userId: user._id,
        productId,
        quantity: item.quantity,
      });

      // Remove the rejected item from the local state (cart UI)
      setCartItems((prevItems) =>
        prevItems.filter(
          (i) =>
            (typeof i.productId === "object"
              ? i.productId._id
              : i.productId) !== productId
        )
      );

      alert("Item rejected and stock restored.");
    } catch (err) {
      console.error(
        "Error rejecting item:",
        err?.response?.data || err.message
      );
      alert("Failed to reject item.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

      {cartItems.length > 0 ? (
        cartItems.map((item, index) => (
          <div key={index} className="bg-white p-4 rounded shadow mb-4">
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-gray-700">Price: ₹{item.price}</p>
            <p className="text-gray-700">Quantity: {item.quantity}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => handleConfirm(item)}
                className="bg-green-600 text-white px-3 py-1 rounded"
              >
                Confirm Order
              </button>
              <button
                onClick={() => handleReject(item)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Reject
              </button>
            </div>
          </div>
        ))
      ) : (
        <p className="text-gray-600">No items in cart.</p>
      )}

      <button onClick={() => navigate("/products")} className="mt-6 ">
        Back to Products
      </button>
    </div>
  );
}
