const supabase = require("./supabase");
const axios = require("axios");

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;
const OWNER_NUMBER = "918882077169";

async function saveBill({
  phone,
  model,
  shopName,
  imageUrl
}) {
  const { error } = await supabase
    .from("bills")
    .insert([
      {
        phone,
        model: model || null,
        shop_name: shopName || null,
        image_url: imageUrl || null,
        created_at: new Date()
      }
    ]);

  if (error) {
    console.log("Bill save error:", error.message);
  }
}

async function forwardBillToOwner(imageId, customerPhone) {
  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    // Send notification text first
    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: OWNER_NUMBER,
        type: "text",
        text: {
          body: `🧾 New Bill Received!\n\n📞 Customer: ${customerPhone}\n⏰ Time: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}`
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    // Forward the image
    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: OWNER_NUMBER,
        type: "image",
        image: {
          id: imageId
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Bill forwarded to owner");

  } catch (error) {
    console.log("Forward error:", error.response?.data || error.message);
  }
}

module.exports = {
  saveBill,
  forwardBillToOwner
};