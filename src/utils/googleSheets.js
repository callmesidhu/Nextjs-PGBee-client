import { GoogleAuth } from "google-auth-library";
import { google } from "googleapis";

// Initialize Google Auth with service account credentials
function initializeGoogleAuth() {
  try {
    const credentials = JSON.parse(process.env.SERVICE_ACCOUNT_CREDENTIALS);

    const auth = new GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    return auth;
  } catch (error) {
    console.error("Error initializing Google Auth:", error);
    throw new Error("Failed to initialize Google Sheets authentication");
  }
}

// Create or get spreadsheet
async function getOrCreateSpreadsheet(auth, spreadsheetName = "PG Bookings") {
  try {
    const sheets = google.sheets({ version: "v4", auth });

    // For simplicity, we'll use a hardcoded spreadsheet ID
    // In production, you might want to create a new spreadsheet or search for an existing one
    const spreadsheetId = process.env.GOOGLE_SPREADSHEET_ID;

    if (spreadsheetId) {
      return { sheets, spreadsheetId };
    }

    // If no spreadsheet ID is provided, create a new one
    const drive = google.drive({ version: "v3", auth });

    const createResponse = await sheets.spreadsheets.create({
      resource: {
        properties: {
          title: spreadsheetName,
        },
        sheets: [
          {
            properties: {
              title: "Bookings",
              gridProperties: {
                rowCount: 1000,
                columnCount: 15,
              },
            },
          },
        ],
      },
    });

    const newSpreadsheetId = createResponse.data.spreadsheetId;

    // Add headers to the spreadsheet
    await sheets.spreadsheets.values.update({
      spreadsheetId: newSpreadsheetId,
      range: "Bookings!A1:N1",
      valueInputOption: "RAW",
      resource: {
        values: [
          [
            "Timestamp",
            "Name",
            "Department",
            "Phone",
            "Hostel Name",
            "Hostel ID",
            "Room Type",
            "Room Price",
            "Owner Phone",
            "Location",
            "Gender",
            "Amenities",
            "Total Rent Options",
            "Status",
          ],
        ],
      },
    });

    console.log(`Created new spreadsheet with ID: ${newSpreadsheetId}`);
    return { sheets, spreadsheetId: newSpreadsheetId };
  } catch (error) {
    console.error("Error creating/getting spreadsheet:", error);
    throw new Error("Failed to create or access Google Spreadsheet");
  }
}

// Add booking data to spreadsheet
export async function addBookingToSpreadsheet(bookingData) {
  try {
    const auth = initializeGoogleAuth();
    const { sheets, spreadsheetId } = await getOrCreateSpreadsheet(auth);

    const timestamp = new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    const rowData = [
      timestamp,
      bookingData.name || "",
      bookingData.department || "",
      bookingData.phone || "",
      bookingData.hostelName || "",
      bookingData.hostelId || "",
      bookingData.roomType || "",
      bookingData.roomPrice || "",
      bookingData.ownerPhone || "",
      bookingData.location || "",
      bookingData.gender || "",
      bookingData.amenities ? bookingData.amenities.join(", ") : "",
      bookingData.totalRentOptions || "",
      "Pending",
    ];

    // Append the data to the spreadsheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Bookings!A:N",
      valueInputOption: "RAW",
      insertDataOption: "INSERT_ROWS",
      resource: {
        values: [rowData],
      },
    });

    console.log("Booking data added to spreadsheet:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error adding booking to spreadsheet:", error);
    throw new Error("Failed to save booking data to Google Sheets");
  }
}

// Helper function to format amenities for display
export function formatAmenities(amenities) {
  if (!amenities || !Array.isArray(amenities)) return "";
  return amenities.join(", ");
}

// Helper function to format rent options for display
export function formatRentOptions(rentOptions) {
  if (!rentOptions || !Array.isArray(rentOptions)) return "";
  return rentOptions
    .map((rent) => `${rent.sharingType}: ₹${rent.price}`)
    .join("; ");
}
