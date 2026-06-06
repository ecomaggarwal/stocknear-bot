const { getInventory } = require("./sheets");

// Primary brands shown first (max 9)
const PRIMARY_BRANDS = [
  "Samsung",
  "Apple",
  "OnePlus",
  "Realme",
  "Vivo",
  "Oppo",
  "Motorola",
  "Nokia",
  "Google"
];

function normalize(value) {
  return String(value).trim().toLowerCase();
}

function uniqueValues(array) {
  return [
    ...new Set(
      array
        .filter(value => value !== null && value !== undefined && value !== "")
        .map(value => String(value).trim())
    )
  ];
}

async function getBrands() {
  const inventory = await getInventory();

  const allBrands = uniqueValues(
    inventory.map(item => item.brand)
  );

  return allBrands;
}

async function getModels(brand) {
  const inventory = await getInventory();

  const models = inventory
    .filter(item => normalize(item.brand) === normalize(brand))
    .map(item => item.model);

  return [...uniqueValues(models), "Any Model"];
}

async function getRam(brand, model) {
  const inventory = await getInventory();

  let filtered = inventory.filter(
    item => normalize(item.brand) === normalize(brand)
  );

  if (model !== "Any Model") {
    filtered = filtered.filter(
      item => normalize(item.model) === normalize(model)
    );
  }

  const ramOptions = filtered.map(item => item.ram);

  return [...uniqueValues(ramOptions), "Any RAM"];
}

async function getStorage(brand, model, ram) {
  const inventory = await getInventory();

  let filtered = inventory.filter(
    item => normalize(item.brand) === normalize(brand)
  );

  if (model !== "Any Model") {
    filtered = filtered.filter(
      item => normalize(item.model) === normalize(model)
    );
  }

  if (ram !== "Any RAM") {
    filtered = filtered.filter(
      item => normalize(item.ram) === normalize(ram)
    );
  }

  const storageOptions = filtered.map(item => item.storage);

  return [...uniqueValues(storageOptions), "Any Storage"];
}

async function getColors(brand, model, ram, storage) {
  const inventory = await getInventory();

  let filtered = inventory.filter(
    item => normalize(item.brand) === normalize(brand)
  );

  if (model !== "Any Model") {
    filtered = filtered.filter(
      item => normalize(item.model) === normalize(model)
    );
  }

  if (ram !== "Any RAM") {
    filtered = filtered.filter(
      item => normalize(item.ram) === normalize(ram)
    );
  }

  if (storage !== "Any Storage") {
    filtered = filtered.filter(
      item => normalize(item.storage) === normalize(storage)
    );
  }

  const colors = filtered.map(item => item.color);

  return [...uniqueValues(colors), "Any Color"];
}

async function searchInventory({ brand, model, ram, storage, color }) {
  const inventory = await getInventory();

  let filtered = inventory.filter(
    item =>
      normalize(item.brand) === normalize(brand) &&
      item.stock > 0
  );

  if (model !== "Any Model") {
    filtered = filtered.filter(
      item => normalize(item.model) === normalize(model)
    );
  }

  if (ram !== "Any RAM") {
    filtered = filtered.filter(
      item => normalize(item.ram) === normalize(ram)
    );
  }

  if (storage !== "Any Storage") {
    filtered = filtered.filter(
      item => normalize(item.storage) === normalize(storage)
    );
  }

  if (color !== "Any Color") {
    filtered = filtered.filter(
      item => normalize(item.color) === normalize(color)
    );
  }

  const freshnessScore = {
    "🟢 Just now": 4,
    "🟡 Recent": 3,
    "🟠 Today": 2,
    "🔴 Old": 1
  };

  filtered.sort((a, b) => {
    const freshnessDiff =
      (freshnessScore[b.freshness] || 0) - (freshnessScore[a.freshness] || 0);
    if (freshnessDiff !== 0) return freshnessDiff;

    const stockDiff = b.stock - a.stock;
    if (stockDiff !== 0) return stockDiff;

    return a.price - b.price;
  });

  return filtered;
}

module.exports = {
  getBrands,
  getModels,
  getRam,
  getStorage,
  getColors,
  searchInventory,
  PRIMARY_BRANDS
};