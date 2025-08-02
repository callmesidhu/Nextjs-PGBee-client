"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import api from "@/utils/authInstance";
import PGDetails from "@/components/details/PGDetails";
import RoomFilter from "@/components/filter/RoomFilter";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import MobileSidebar from "@/components/dashboard/MobileBar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function PGDetailsPage() {
  const params = useParams();
  const [pgData, setPgData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const fetchPGDetails = async () => {
      try {
        setLoading(true);

        // Log the parameters we're working with
        console.log("PG Details Page - Params:", params);
        console.log("PG ID:", params.details);
        console.log("API Base URL:", process.env.NEXT_PUBLIC_API_BASE);

        if (!params.details) {
          throw new Error("No PG ID provided");
        }

        // Get all hostels first, then filter by ID
        const response = await api.get(`/hostel`);

        // Find the specific hostel by ID
        const hostels = response.data.data.hostels;
        const pgDetails = hostels.find(
          (hostel) => hostel.id === params.details
        );

        if (!pgDetails) {
          throw new Error(`PG with ID ${params.details} not found`);
        }

        // Convert rentOptions to room format for RoomFilter component
        const rooms =
          pgDetails.Rents?.map((rent, index) => ({
            id: `room-${index}`,
            type: rent.sharingType,
            price: rent.rent,
            attachedBathroom: rent.sharingType.includes("attached"),
            available: true,
            description: `${rent.sharingType} room`,
          })) || [];

        // Add rooms array to pgData
        const enrichedPgData = {
          ...pgDetails,
          rooms: rooms,
          // Ensure we have the proper structure for existing components
          name: pgDetails.hostelName || pgDetails.name,
          sex: pgDetails.gender || pgDetails.sex,
          amenities:
            [
              ...(pgDetails.Ammenity?.wifi ? ["Free Wifi"] : []),
              ...(pgDetails.Ammenity?.ac ? ["AC"] : []),
              ...(pgDetails.Ammenity?.kitchen ? ["Kitchen"] : []),
              ...(pgDetails.Ammenity?.parking ? ["Parking"] : []),
              ...(pgDetails.Ammenity?.laundry ? ["Laundry"] : []),
              ...(pgDetails.Ammenity?.tv ? ["TV"] : []),
              ...(pgDetails.Ammenity?.firstAid ? ["First Aid"] : []),
              ...(pgDetails.Ammenity?.workspace ? ["Workspace"] : []),
              ...(pgDetails.Ammenity?.security ? ["Security"] : []),
              ...(pgDetails.Ammenity?.currentBill
                ? ["Electricity Bill Included"]
                : []),
              ...(pgDetails.Ammenity?.waterBill ? ["Water Bill Included"] : []),
              ...(pgDetails.Ammenity?.food ? ["Food Included"] : []),
              ...(pgDetails.Ammenity?.furniture ? ["Furniture"] : []),
              ...(pgDetails.Ammenity?.bed ? ["Bed"] : []),
              ...(pgDetails.Ammenity?.water ? ["Water"] : []),
            ] ||
            pgDetails.amenities ||
            [],
          images:
            pgDetails.Files?.map((file) => file.Location) ||
            pgDetails.images ||
            [],
          rentOptions:
            pgDetails.Rents?.map((rent) => ({
              sharingType: rent.sharingType,
              price: rent.rent,
            })) ||
            pgDetails.rentOptions ||
            [],
          rating: pgDetails.rating || 0.0,
          reviews: pgDetails.Reviews?.length || pgDetails.reviews || 0,
        };

        setPgData(enrichedPgData);
      } catch (error) {
        console.error("Error fetching PG details:", error);
        console.error("API Base URL:", process.env.NEXT_PUBLIC_API_BASE);
        console.error(
          "Full URL attempted:",
          `${process.env.NEXT_PUBLIC_API_BASE}/hostel`
        );
        console.error("Error details:", {
          status: error?.response?.status,
          statusText: error?.response?.statusText,
          data: error?.response?.data,
          message: error?.message,
        });

        const errorMessage =
          error?.response?.status === 404
            ? `PG with ID ${params.details} not found`
            : error?.response?.data?.message ||
              error?.message ||
              "Failed to fetch PG details";

        setError(errorMessage);
        toast.error("Failed to load PG details", {
          style: {
            backgroundColor: "#FFEB67",
            color: "#000",
            fontWeight: "500",
          },
        });
      } finally {
        setLoading(false);
      }
    };

    if (params.details) {
      fetchPGDetails();
    }
  }, [params.details]);

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
        <Navbar onMenuClick={() => setIsMenuOpen(true)} />
        <MobileSidebar
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading PG details...</p>
          </div>
        </div>

        <Footer />
        <ToastContainer />
      </div>
    );
  }

  if (error || !pgData) {
    return (
      <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
        <Navbar onMenuClick={() => setIsMenuOpen(true)} />
        <MobileSidebar
          isOpen={isMenuOpen}
          onClose={() => setIsMenuOpen(false)}
        />

        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-xl">Error loading PG details</p>
            <p className="text-gray-600 mt-2">{error}</p>
            <button
              onClick={() => window.history.back()}
              className="mt-4 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700"
            >
              Go Back
            </button>
          </div>
        </div>

        <Footer />
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen font-sans flex flex-col">
      <Navbar onMenuClick={() => setIsMenuOpen(true)} />
      <MobileSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <main className="flex-grow">
        <PGDetails pgData={pgData} />
        {/* Add Room Filter Section if rooms are available */}
        {pgData.rooms && pgData.rooms.length > 0 && (
          <div className="container mx-auto px-4 pb-8">
            <RoomFilter
              rooms={pgData.rooms}
              hostelGender={pgData.sex || pgData.gender}
              pgData={pgData}
            />
          </div>
        )}
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
}
