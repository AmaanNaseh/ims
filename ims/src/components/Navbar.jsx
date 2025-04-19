import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login
  };

  return (
    <nav className="bg-secondary p-4 shadow-md flex justify-between items-center">
      <Link to="/">
        <h1 className="text-xl font-bold">Inventory Management System</h1>
      </Link>

      <div className="space-x-4">
        {isAdmin ? (
          <>
            <Link
              to="/create-product"
              className="text-black px-3 py-1 bg-accent rounded ml-2"
            >
              Add Product
            </Link>

            <Link to="/dashboard">Dashboard</Link>
          </>
        ) : (
          ""
        )}

        <Link to="/products">Products</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/orders">Orders</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/signup">Signup</Link>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="text-black px-3 py-1 bg-accent rounded ml-2"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
