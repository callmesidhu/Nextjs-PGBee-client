"use client";

import { createContext, useContext, useState } from "react";

const BookingContext = createContext();

export function BookingProvider({ children }) {
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingData, setBookingData] = useState({
    name: "",
    department: "",
    phone: "",
  });

  const updateBookingData = (newData) => {
    setBookingData((prev) => ({ ...prev, ...newData }));
  };

  const selectRoom = (room) => {
    setSelectedRoom(room);
  };

  const clearSelection = () => {
    setSelectedRoom(null);
  };

  const value = {
    selectedRoom,
    bookingData,
    updateBookingData,
    selectRoom,
    clearSelection,
  };

  return (
    <BookingContext.Provider value={value}>{children}</BookingContext.Provider>
  );
}

export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error("useBooking must be used within a BookingProvider");
  }
  return context;
}
