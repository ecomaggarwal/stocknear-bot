const {
  getInventory
} = require(
  "./sheets"
);

function normalize(text) {
  return text
    .toLowerCase()
    .trim();
}

async function getRecommendations(
  query
) {

  const inventory =
    await getInventory();

  const text =
    normalize(query);

  let filtered =
    inventory.filter(
      item => item.stock > 0
    );

  // BRAND

  if (
    text.includes("iphone")
  ) {

    filtered =
      filtered.filter(
        item =>
          normalize(
            item.brand
          ) === "apple"
      );
  }

  if (
    text.includes("samsung")
  ) {

    filtered =
      filtered.filter(
        item =>
          normalize(
            item.brand
          ) === "samsung"
      );
  }

  // PRICE

  const budgetMatch =
    text.match(/\d+/);

  if (budgetMatch) {

    const budget =
      Number(
        budgetMatch[0]
      );

    filtered =
      filtered.filter(
        item =>
          Number(
            item.price
          ) <= budget
      );
  }

  // SORT CHEAPEST FIRST

  filtered.sort(
    (a, b) =>
      a.price - b.price
  );

  return filtered.slice(0, 5);
}

module.exports = {
  getRecommendations
};