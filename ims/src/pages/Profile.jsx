import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setFormData({
          ...formData,
          username: res.data.username,
          email: res.data.email,
        });
      } catch (err) {
        console.error(err);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async () => {
    try {
      const res = await axios.put(
        "http://localhost:5000/api/auth/profile",
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(res.data.msg);
    } catch (err) {
      console.error(err);
      setMessage("Update failed");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your account?"))
      return;
    try {
      await axios.delete("http://localhost:5000/api/auth/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect to login
    } catch (err) {
      console.error(err);
      setMessage("Delete failed");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Profile</h2>
      {message && <p className="text-center text-pink-600">{message}</p>}
      <input
        type="text"
        name="username"
        value={formData.username}
        onChange={handleChange}
        placeholder="Username"
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Email"
        className="w-full mb-4 p-2 border rounded"
      />
      <input
        type="password"
        name="password"
        value={formData.password}
        onChange={handleChange}
        placeholder="New Password"
        className="w-full mb-4 p-2 border rounded"
      />
      <button
        onClick={handleUpdate}
        className="w-full bg-pink-500 text-white py-2 rounded mb-2 hover:bg-pink-600"
      >
        Update Profile
      </button>
      <button
        onClick={handleDelete}
        className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
      >
        Delete Account
      </button>
    </div>
  );
};

export default Profile;
