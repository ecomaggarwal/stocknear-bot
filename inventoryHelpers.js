const { getInventory } = require("./sheets");

const PAGE_SIZE = 9;

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

// Categories that don't need RAM/Storage
const NO_RAM_STORAGE_CATEGORIES = ["Earbuds", "Smartwatch"];

async function getCategories() {
  const inventory = await getInventory();
  return uniqueValues(inventory.map(item => item.category));
}

async function getBrands(category) {
  const inventory = await getInventory();
  const filtered = inventory.filter(
    item => normalize(item.category) === normalize(category)
  );
  return uniqueValues(filtered.map(item => item.brand));
}

async function getSeries(category, brand) {
  const inventory = await getInventory();
  const filtered = inventory.filter(
    item =>
      normalize(item.category) === normalize(category) &&
      normalize(item.brand) === normalize(brand)
  );
  const series = filtered.map(item => item.series);
  return [...uniqueValues(series), "Any Series"];
}

async function getModels(category, brand, series) {
  const inventory = await getInventory();

  let filtered = inventory.filter(
    item =>
      normalize(item.category) === normalize(category) &&
      normalize(item.brand) === normalize(brand)
  );

  if (series && series !== "Any Series") {
    filtered = filtered.filter(
      item => normalize(item.series) === normalize(series)
    );
  }

  const models = filtered.map(item => item.model);
  return [...uniqueValues(models), "Any Model"];
}

async function getRam(category, brand, series, model) {
  const inventory = await getInventory();

  let filtered = inventory.filter(
    item =>
      normalize(item.category) === normalize(category) &&
      normalize(item.brand) === normalize(brand)
  );

  if (series && series !== "Any Series") {
    filtered = filtered.filter(
      item => normalize(item.series) === normalize(series)
    );
  }

  if (model !== "Any Model") {
    filtered = filtered.filter(
      item => normalize(item.model) === normalize(model)
    );
  }

  const ramOptions = filtered.map(item => item.ram);
  return [...uniqueValues(ramOptions), "Any RAM"];
}

async function getStorage(category, brand, series, model, ram) {
  const inventory = await getInventory();

  let filtered = inventory.filter(
    item =>
      normalize(item.category) === normalize(category) &&
      normalize(item.brand) === normalize(brand)
  );

  if (series && series !== "Any Series") {
    filtered = filtered.filter(
      item => normalize(item.series) === normalize(series)
    );
  }

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

async function getColors(category, brand, series, model, ram, storage) {
  const inventory = await getInventory();

  let filtered = inventory.filter(
    item =>
      normalize(item.category) === normalize(category) &&
      normalize(item.brand) === normalize(brand)
  );

  if (series && series !== "Any Series") {
    filtered = filtered.filter(
      item => normalize(item.series) === normalize(series)
    );
  }

  if (model !== "Any Model") {
    filtered = filtered.filter(
      item => normalize(item.model) === normalize(model)
    );
  }

  if (ram && ram !== "Any RAM") {
    filtered = filtered.filter(
      item => normalize(item.ram) === normalize(ram)
    );
  }

  if (storage && storage !== "Any Storage") {
    filtered = filtered.filter(
      item => normalize(item.storage) === normalize(storage)
    );
  }

  const colors = filtered.map(item => item.color);
  return [...uniqueValues(colors), "Any Color"];
}

async function searchInventory({
  category, brand, series, model, ram, storage, color
}) {
  const inventory = await getInventory();

  let filtered = inventory.filter(
    item =>
      normalize(item.category) === normalize(category) &&
      normalize(item.brand) === normalize(brand) &&
      item.stock > 0
  );

  if (series && series !== "Any Series") {
    filtered = filtered.filter(
      item => normalize(item.series) === normalize(series)
    );
  }

  if (model !== "Any Model") {
    filtered = filtered.filter(
      item => normalize(item.model) === normalize(model)
    );
  }

  if (ram && ram !== "Any RAM") {
    filtered = filtered.filter(
      item => normalize(item.ram) === normalize(ram)
    );
  }

  if (storage && storage !== "Any Storage") {
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
  getCategories,
  getBrands,
  getSeries,
  getModels,
  getRam,
  getStorage,
  getColors,
  searchInventory,
  NO_RAM_STORAGE_CATEGORIES
};