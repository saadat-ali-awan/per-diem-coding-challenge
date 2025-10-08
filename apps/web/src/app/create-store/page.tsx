"use client";

import { createStore } from "@/lib/api";
import { useState } from "react";

export default function CreateStorePage() {
  const [subDomain, setSubDomain] = useState("");
  const [name, setName] = useState("");
  const [welcome, setWelcome] = useState("");
  const [primary, setPrimary] = useState("#2563eb");
  const [background, setBackground] = useState("#ffffff");
  const [fontFamily, setFontFamily] = useState("Inter");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await createStore(
        subDomain,
        name,
        welcome,
        primary,
        background,
        fontFamily
      );

      if (res.success) {
        setMessage("✅ Store created successfully!");
      } else {
        setMessage(`❌ Error: ${res.message || "Failed to create store"}`);
      }
    } catch {
      setMessage("❌ Network error. Check if the API is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-6 text-black">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full border border-gray-100"
      >
        <h1 className="text-2xl font-semibold mb-6 text-center">
          Create a Store
        </h1>

        {/* Subdomain */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Store Subdomain
        </label>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="my-store"
          value={subDomain}
          onChange={(e) => setSubDomain(e.target.value)}
          required
        />

        {/* Name */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Store Name
        </label>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="My Store"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        {/* Welcome */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Welcome Message (optional)
        </label>
        <textarea
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          placeholder="Welcome to My Store!"
          value={welcome}
          onChange={(e) => setWelcome(e.target.value)}
        />

        {/* Theme */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Primary Color
            </label>
            <input
              type="color"
              value={primary}
              onChange={(e) => setPrimary(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Background Color
            </label>
            <input
              type="color"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
              className="w-full h-10 border border-gray-300 rounded-md cursor-pointer"
            />
          </div>
        </div>

        {/* Font */}
        <label className="block mb-2 text-sm font-medium text-gray-700">
          Font Family
        </label>
        <select
          className="w-full p-2 mb-4 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
          value={fontFamily}
          onChange={(e) => setFontFamily(e.target.value)}
        >
          <option value="Inter">Inter</option>
          <option value="Roboto">Roboto</option>
          <option value="Poppins">Poppins</option>
          <option value="Open Sans">Open Sans</option>
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium"
        >
          {loading ? "Creating..." : "Create Store"}
        </button>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
}
