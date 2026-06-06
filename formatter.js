function formatResults(results) {

  if (!results.length) {

    return (
`❌ No matching phones found.

Try:
- another color
- Any RAM
- Any Storage
- different model

Or type your requirement again 🔍`
    );
  }

  let response = "";

  const first = results[0];

  response +=
`✅ We found nearby stores matching your selection.

⚡ Availability changes throughout the day.
📞 Please call the store before visiting.

━━━━━━━━━━━━

📱 ${first.brand} ${first.model}

💾 ${first.ram} | ${first.storage}
🎨 ${first.color}

🎉 Great news! We found ${results.length} nearby store${results.length > 1 ? 's' : ''} for your selected phone.

━━━━━━━━━━━━

`;

  results
    .slice(0, 10)
    .forEach((item, index) => {

      response +=
`${index + 1}. 🏪 ${item.shopName}

📍 ${item.location}

📍 View Shop Location:
${item.mapsLink}

${item.shopPhone ? `☎️ ${item.shopPhone}` : ""}

📞 Call before visiting the shop

━━━━━━━━━━━━

`;
    });

  response +=
`💡 Type:
- restart
- stop

━━━━━━━━━━━━

🛒 *Bought a phone from one of these stores?*
Earn upto ₹2000 cashback!

Just send a photo of your purchase bill here and our team will process your cashback within 24 hours. 💰`;

  if (results.length > 10) {
    response +=
`\n\nShowing limited results. Use specific model/RAM/storage/color for better matches.`;
  }

  return response;
}

module.exports = {
  formatResults
};