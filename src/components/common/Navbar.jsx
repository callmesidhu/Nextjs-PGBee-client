import { Icon, ICONS } from "@/components/dashboard/Icons";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import NoSSR from "../NoSSR";

const Navbar = ({ onMenuClick }) => {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = Cookies.get("accessToken");
    setIsAuthenticated(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    setIsAuthenticated(false);
    window.location.reload();
  };

  const handleLoginSignup = () => {
    router.push("/auth/login");
  };

  return (
    <nav className="bg-white shadow-sm py-5 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center">
          <h1 className="text-3xl font-bold text-gray-800">
            <img src="/PgBee.png" alt="PgBee Logo" className="h-8" />
          </h1>
        </div>

        {/* Search Bar */}
        <div className="max-w-xl mx-4 hidden sm:flex items-center border rounded-full shadow-sm">
          <input
            type="text"
            placeholder="Bangalore, India"
            className="w-full py-2 pl-3 pr-4 lg:px-4 rounded-l-full focus:outline-none"
          />
          <button className="flex items-center bg-gray-100 text-gray-600 px-4 py-1.5 rounded-full mx-2 whitespace-nowrap text-sm hover:bg-gray-200">
            <Icon path={ICONS.nearMe} className="w-4 h-4 mr-1" />
            Near me
          </button>
          <button className="px-6 py-2 bg-gray-800 text-white rounded-2xl hover:bg-gray-700 font-semibold">
            Search
          </button>
        </div>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-4 text-sm font-medium text-gray-600">
          <a href="#" className="flex items-center hover:text-gray-900">
            <Icon path={ICONS.globe} className="w-5 h-5 mr-1" />
            <span>EN</span>
          </a>
          <a href="#" className="flex items-center hover:text-gray-900">
            <Icon path={ICONS.rupee} className="w-5 h-5 mr-1" />
            <span>INR</span>
          </a>
          <a href="#" className="flex items-center hover:text-gray-900">
            <Icon path={ICONS.heart} className="w-5 h-5 mr-1" />
            <span>Wishlist</span>
          </a>
          {/* Auth section */}
          <NoSSR>
            {isAuthenticated ? (
              <button
                className="p-5 flex items-center cursor-pointer"
                onClick={handleLogout}
              >
                <Icon path={ICONS.user} className="w-5 h-5 mr-1" />
                <span>Logout</span>
              </button>
            ) : (
              <button
                className="p-5 flex items-center cursor-pointer"
                onClick={handleLoginSignup}
              >
                <Icon path={ICONS.user} className="w-5 h-5 mr-1" />
                <span>Login/Signup</span>
              </button>
            )}
          </NoSSR>
        </nav>

        {/* Mobile Menu Toggle */}
        <div className="md:hidden">
          <button
            onClick={onMenuClick}
            className="p-2 rounded-md text-gray-600 hover:bg-gray-100"
          >
            <Icon path={ICONS.menu} className="w-6 h-6" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
