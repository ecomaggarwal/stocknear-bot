function formatResults(results) {

  if (!results.length) {

    return (
      "❌ No matching phones found."
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

💰 ₹${Number(
  item.price
).toLocaleString("en-IN")}

📦 Stock: ${item.stock}

${item.freshness}

📍 ${item.location}

🗺 ${item.mapsLink}

━━━━━━━━━━━━

`;
    }
  );

  return response;
}

module.exports = {
  formatResults
};