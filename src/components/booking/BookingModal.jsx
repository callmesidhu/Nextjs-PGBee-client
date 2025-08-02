"use client";

import { useState } from "react";
import { toast } from "react-toastify";
import { openWhatsApp } from "@/utils/whatsappUtils";

export default function BookingModal({
  isOpen,
  onClose,
  pgData,
  selectedRoom = null,
}) {
  const [formData, setFormData] = useState({
    referralCode: "PGB100",
    name: "",
    department: "",
    phone: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name || !formData.phone) {
      toast.error("Please fill in all required fields", {
        style: {
          backgroundColor: "#FFEB67",
          color: "#000",
          fontWeight: "500",
        },
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare booking data
      const bookingData = {
        ...formData,
        hostelName: pgData.name || pgData.hostelName,
        hostelId: pgData.id,
        roomType: selectedRoom?.type || "General Inquiry",
        roomPrice: selectedRoom?.price || "",
        ownerPhone: pgData.ownerPhone || pgData.phone || "916235401737",
        location: pgData.location || pgData.address,
        gender: pgData.sex || pgData.gender,
        amenities: pgData.amenities || [],
        totalRentOptions: pgData.rentOptions?.length || 0,
      };

      // Save to Google Sheets
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error("Failed to save booking data");
      }

      // Open WhatsApp with pre-filled message
      const { message } = openWhatsApp(bookingData);

      toast.success("Booking request sent successfully!", {
        style: {
          backgroundColor: "#FFEB67",
          color: "#000",
          fontWeight: "500",
        },
      });

      // Reset form and close modal
      setFormData({
        referralCode: "PGB100",
        name: "",
        department: "",
        phone: "",
      });
      onClose();
    } catch (error) {
      console.error("Error processing booking:", error);
      toast.error("Failed to process booking. Please try again.", {
        style: {
          backgroundColor: "#FFEB67",
          color: "#000",
          fontWeight: "500",
        },
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Book Now</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
          </div>

          {/* PG Details Summary */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">
              {pgData.name || pgData.hostelName}
            </h3>
            {selectedRoom ? (
              <div className="text-sm text-gray-600">
                <p>
                  <strong>Room:</strong> {selectedRoom.type}
                </p>
                <p>
                  <strong>Price:</strong> ₹{selectedRoom.price.toLocaleString()}
                  /month
                </p>
                <p>
                  <strong>Bathroom:</strong>{" "}
                  {selectedRoom.attachedBathroom ? "Attached" : "Common"}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                General inquiry about this PG
              </p>
            )}
            {pgData.location && (
              <p className="text-sm text-gray-600 mt-1">
                <strong>Location:</strong> {pgData.location}
              </p>
            )}
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="referralCode"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Referral Code
              </label>
              <input
                type="text"
                id="referralCode"
                name="referralCode"
                value={formData.referralCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="PGB100"
              />
            </div>

            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label
                htmlFor="department"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Department/Course
              </label>
              <input
                type="text"
                id="department"
                name="department"
                value={formData.department}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Computer Science, MBA, etc."
              />
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your phone number"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Sending..." : "Send WhatsApp Message"}
              </button>
            </div>
          </form>

          {/* Info Note */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> This will open WhatsApp with a pre-filled
              message containing your details. Your information will also be
              saved for the PG owner's reference.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
