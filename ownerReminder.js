const axios = require("axios");
require("dotenv").config();

const token = process.env.WHATSAPP_TOKEN;
const phoneNumberId = process.env.PHONE_NUMBER_ID;

// Owner contacts sheet details
const OWNER_SHEET_ID = "1pWVjEn9OvkCU-zQRnb5kJ3s-_b2PWiXIen4vExcNEnc";
const OWNER_SHEET_GID = "0";

// Fetch owner contacts from Google Sheet
async function getOwnerContacts() {
  try {
    const url = `https://docs.google.com/spreadsheets/d/${OWNER_SHEET_ID}/gviz/tq?tqx=out:json&gid=${OWNER_SHEET_GID}`;
    const response = await axios.get(url);
    const json = response.data
      .replace("/*O_o*/", "")
      .replace("google.visualization.Query.setResponse(", "")
      .replace(/\);$/, "");

    const parsed = JSON.parse(json);
    const rows = parsed.table.rows;

    return rows
      .filter(row => row.c[0]?.v && row.c[1]?.v)
      .map(row => ({
        ownerName: String(row.c[0].v).trim(),
        ownerPhone: String(row.c[1].v).trim()
      }));

  } catch (error) {
    console.log("Error fetching owner contacts:", error.message);
    return [];
  }
}

// Send reminder to a single owner
async function sendReminderToOwner(ownerName, ownerPhone) {
  try {
    const url = `https://graph.facebook.com/v19.0/${phoneNumberId}/messages`;

    await axios.post(
      url,
      {
        messaging_product: "whatsapp",
        to: ownerPhone,
        type: "template",
        template: {
          name: "stock_update_reminder",
          language: {
            code: "en"
          },
          components: [
            {
              type: "body",
              parameters: [
                {
                  type: "text",
                  text: ownerName
                }
              ]
            }
          ]
        }
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    console.log(`Reminder sent to ${ownerName} (${ownerPhone})`);

  } catch (error) {
    console.log(
      `Error sending to ${ownerName}:`,
      error.response?.data || error.message
    );
  }
}

// Send reminders to all owners
async function sendRemindersToAll() {
  console.log("Sending stock update reminders...");

  const owners = await getOwnerContacts();

  if (!owners.length) {
    console.log("No owner contacts found.");
    return;
  }

  console.log(`Found ${owners.length} owners. Sending reminders...`);

  for (const owner of owners) {
    await sendReminderToOwner(owner.ownerName, owner.ownerPhone);
    // Small delay between messages to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  console.log("All reminders sent.");
}

module.exports = {
  sendRemindersToAll,
  getOwnerContacts
};