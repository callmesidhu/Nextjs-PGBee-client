// Helper function to encode text for WhatsApp URL
function encodeForWhatsApp(text) {
  return encodeURIComponent(text);
}

// Generate WhatsApp message template
export function generateWhatsAppMessage(bookingData) {
  const {
    referralCode = "PGB100",
    name = "",
    department = "",
    phone = "",
    hostelName = "",
    roomType = "",
    roomPrice = "",
    amenities = [],
    location = "",
    ownerPhone = "",
  } = bookingData;

  let message = `Referral Code: ${referralCode}\n`;
  message += `Name: ${name}\n`;
  message += `Department: ${department}\n`;
  message += `Phone: ${phone}\n`;
  message += `Hostel Name: ${hostelName}\n`;

  if (roomType && roomPrice) {
    message += `Room Type: ${roomType}\n`;
    message += `Room Price: ₹${roomPrice}/month\n`;
  }

  if (location) {
    message += `Location: ${location}\n`;
  }

  if (amenities && amenities.length > 0) {
    message += `Amenities: ${amenities.join(", ")}\n`;
  }

  message += `\nI'm interested in booking this PG. Please provide more details.`;

  return message;
}

// Generate WhatsApp URL with message
export function generateWhatsAppURL(ownerPhone, message) {
  // Remove any non-numeric characters from phone number
  const cleanPhone = ownerPhone.replace(/\D/g, "");

  // Ensure phone number starts with country code (91 for India)
  const formattedPhone = cleanPhone.startsWith("91")
    ? cleanPhone
    : `91${cleanPhone}`;

  const encodedMessage = encodeForWhatsApp(message);

  return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}

// Open WhatsApp with pre-filled message
export function openWhatsApp(bookingData) {
  const message = generateWhatsAppMessage(bookingData);
  const whatsAppURL = generateWhatsAppURL(
    bookingData.ownerPhone || "916235401737",
    message
  );

  // Open in new tab/window
  window.open(whatsAppURL, "_blank");

  return { message, whatsAppURL };
}

// Format phone number for display
export function formatPhoneNumber(phone) {
  if (!phone) return "";

  // Remove any non-numeric characters
  const cleaned = phone.replace(/\D/g, "");

  // Format as +91 XXXXX XXXXX if it's an Indian number
  if (cleaned.length === 10) {
    return `+91 ${cleaned.slice(0, 5)} ${cleaned.slice(5)}`;
  } else if (cleaned.length === 12 && cleaned.startsWith("91")) {
    return `+91 ${cleaned.slice(2, 7)} ${cleaned.slice(7)}`;
  }

  return phone;
}
