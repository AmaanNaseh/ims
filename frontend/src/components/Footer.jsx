import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-secondary p-4 mt-8 text-center bg-green-500 w-full">
      <Link to={"/attributions"}>
        <p className="my-2">Attributions</p>
      </Link>
      <p>
        @{new Date().getFullYear()} Inventory Management System. All Rights
        Reserved.
      </p>
    </footer>
  );
}
