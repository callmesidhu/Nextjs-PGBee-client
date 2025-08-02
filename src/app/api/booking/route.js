import { NextResponse } from "next/server";
import { addBookingToSpreadsheet } from "@/utils/googleSheets";

export async function POST(request) {
  try {
    const bookingData = await request.json();

    // Validate required fields
    if (!bookingData.hostelName || !bookingData.ownerPhone) {
      return NextResponse.json(
        { error: "Missing required fields: hostelName and ownerPhone" },
        { status: 400 }
      );
    }

    // Add booking to Google Spreadsheet
    const result = await addBookingToSpreadsheet(bookingData);

    return NextResponse.json({
      success: true,
      message: "Booking data saved successfully",
      data: result,
    });
  } catch (error) {
    console.error("Error processing booking:", error);

    return NextResponse.json(
      {
        error: "Failed to process booking",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
