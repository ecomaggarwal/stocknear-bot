const axios = require("axios");
require("dotenv").config();

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

async function sendMessage(to, message) {
  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "text",
        text: { body: message }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Message sent");

  } catch (error) {
    console.log("SEND ERROR:");
    if (error.response) {
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
  }
}

async function sendListMessage(to, title, buttonText, options) {
  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    // Build rows
    const allRows = options.map(option => ({
      id: option,
      title: option.slice(0, 24)
    }));

    // Split into sections of max 10 (WhatsApp limit)
    const sections = [];
    for (let i = 0; i < allRows.length; i += 10) {
      sections.push({
        title: "Options",
        rows: allRows.slice(i, i + 10)
      });
    }

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to,
        type: "interactive",
        interactive: {
          type: "list",
          body: { text: title },
          action: {
            button: buttonText,
            sections
          }
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log("List message sent");

  } catch (error) {
    console.log("SEND ERROR:");
    if (error.response) {
      console.log(JSON.stringify(error.response.data, null, 2));
    } else {
      console.log(error.message);
    }
  }
}

module.exports = {
  sendMessage,
  sendListMessage
};