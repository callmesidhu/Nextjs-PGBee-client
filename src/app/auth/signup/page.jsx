"use client";

import { setTokens } from "@/utils/auth";
import api from "@/utils/authInstance";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FcGoogle } from "react-icons/fc";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");

  const handleSignup = async () => {
    try {
      const res = await api.post("/auth/signup", {
        name,
        phoneNo,
        email,
        password,
        role,
      });

      const { accessToken, refreshToken } = res.data.data;
      
      setTokens(accessToken, refreshToken);

      toast.success("Signup successful! Redirecting...", {
        position: "top-right",
        autoClose: 2000,
        style: {
          backgroundColor: "#FFEB67",
          color: "#000",
          fontWeight: "500",
        },
      });

      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Signup failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
        style: {
          backgroundColor: "#FFEB67",
          color: "#000",
          fontWeight: "500",
          borderRadius: "8px",
        },
      });
    }
  };

  const handleGoogleSignup = () => {
    // Redirect to your backend Google OAuth endpoint
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
  };

  return (
    <div className="relative min-h-screen bg-[#f9f9f9] flex flex-col items-center justify-center overflow-hidden">
      {/* Toast container */}
      <ToastContainer />

      {/* Logo */}
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-20 mt-4">
        <Image src="/PgBee.png" alt="PgBee Logo" width={120} height={50} />
      </div>

      {/* Form Card */}
      <div className="w-full max-w-md p-6 bg-white rounded-xl shadow-xl z-10">
        {/* Tabs */}
        <div className="flex mb-6 rounded-lg overflow-hidden border border-gray-300">
          <button className="w-1/2 py-2 bg-black text-white font-medium">Sign up</button>
          <button onClick={() => router.push("/auth/login")} className="w-1/2 py-2 bg-white text-black font-medium">
            Log in
          </button>
        </div>

        {/* Google Sign Up Button */}
        <button
          onClick={handleGoogleSignup}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors mb-4"
        >
          <FcGoogle className="text-xl" />
          <span className="text-gray-700 font-medium">Sign up with Google</span>
        </button>

        {/* OR Divider */}
        <div className="relative mb-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">OR</span>
          </div>
        </div>

        {/* Name + Phone */}
        <div className="flex gap-2 mb-4">
          <div className="w-1/2">
            <label className="block text-sm mb-1 text-gray-700">Name <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
          <div className="w-1/2">
            <label className="block text-sm mb-1 text-gray-700">Phone <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={phoneNo}
              onChange={(e) => setPhoneNo(e.target.value)}
              placeholder="Enter your phone"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
          </div>
        </div>

        {/* Email */}
        <div className="mb-2">
          <label className="block text-sm mb-1 text-gray-700">Email <span className="text-red-500">*</span></label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm mb-1 text-gray-700">Password <span className="text-red-500">*</span></label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
          />
        </div>

        {/* Terms */}
        <div className="flex items-start gap-2 mb-6 text-sm">
          <input type="checkbox" className="mt-1" />
          <p className="text-gray-700">
            By creating an account, I agree to the{" "}
            <a href="#" className="text-blue-600 underline">Terms of use</a> and{" "}
            <a href="#" className="text-blue-600 underline">Privacy Policy</a>.
          </p>
        </div>

        {/* Submit */}
        <button
          onClick={handleSignup}
          className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800"
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}