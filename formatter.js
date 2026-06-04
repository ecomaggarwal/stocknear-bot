const {
  formatDistance
} = require("./locationHelper");

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
`📱 ${first.brand} ${first.model}

💾 ${first.ram} | ${first.storage}
🎨 ${first.color}

📍 Showing top ${Math.min(results.length, 10)} of ${results.length} store(s)

━━━━━━━━━━━━

`;

  results
    .slice(0, 10)
    .forEach((item, index) => {

      const distanceText =
        formatDistance(item.distanceKm);

      response +=
`${index + 1}. 🏪 ${item.shopName}

${item.freshness}
${distanceText ? `📏 ${distanceText}\n` : ""}📍 ${item.location}

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
- stop`;

  if (results.length > 10) {
    response +=
`\n\nShowing limited results. Use specific model/RAM/storage/color for better matches.`;
  }

  return response;
}

module.exports = {
  formatResults
};