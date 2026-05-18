function formatResults(results) {

  if (!results.length) {

    return (
`❌ No matching phones found.

Try:
• another color
• Any RAM
• Any Storage
• different model

Or type your requirement again 🔍`
);
  }

  let response = "";

  const first = results[0];

  response +=
`📱 ${first.brand} ${first.model}

💾 ${first.ram} | ${first.storage}
🎨 ${first.color}

📍 Available at ${results.length} store(s)

━━━━━━━━━━━━

`;

  results.forEach(
    (item, index) => {

      response +=
`${index + 1}. 🏪 ${item.shopName}

${item.freshness}

📍 ${item.location}

📍 View Shop Location:
${item.mapsLink}

${item.shopPhone ? `☎️ ${item.shopPhone}` : ""}

━━━━━━━━━━━━

`;
    }
  );

  response +=
`💡 Type:
• restart
• menu
• reset

to start a new search anytime.`;

  return response;
}

module.exports = {
  formatResults
};