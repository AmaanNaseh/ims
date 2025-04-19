import { useEffect, useState } from "react";
import axios from "axios";

export default function Orders() {
  const [orders, setOrders] = useState([]);

  const getOrders = async () => {
    const token = localStorage.getItem("token");
    const res = await axios.get("http://localhost:5000/api/orders/history", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOrders(res.data);
  };

  useEffect(() => {
    getOrders();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Orders</h2>
      <ul className="space-y-4">
        {orders.map((order, idx) => (
          <li key={idx} className="bg-white p-4 shadow rounded">
            <p>
              <strong>Product:</strong> {order.product?.name || "N/A"}
            </p>
            <p>
              <strong>Quantity:</strong> {order.quantity}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {order.date
                ? new Date(order.date).toLocaleString()
                : "Not Available"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
