const axios = require("axios");
require("dotenv").config();

const SHEET_ID = process.env.SHEET_ID;
const SHEET_GID = process.env.SHEET_GID;

let inventoryCache = [];

let lastFetchTime = 0;

const CACHE_DURATION =
  5 * 60 * 1000;

async function getInventory() {

  const now = Date.now();

if (
  inventoryCache.length &&
  now - lastFetchTime <
    CACHE_DURATION
) {
  console.log(
  "Using inventory cache"
);

  return inventoryCache;
}

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;

  try {

    console.log(
  "Fetching fresh inventory"
);

  const response =
    await axios.get(url);

  const text =
    response.data;

  const json = JSON.parse(
    text
      .substring(47)
      .slice(0, -2)
  );

  const rows =
    json.table.rows;

  inventoryCache =
    rows.map(row => ({
      shopId:
        row.c[0]?.v || "",

      shopName:
        row.c[1]?.v || "",

      brand:
        row.c[2]?.v || "",

      model:
        row.c[3]?.v || "",

      ram:
        row.c[4]?.v || "",

      storage:
        row.c[5]?.v || "",

      color:
        row.c[6]?.v || "",

      price:
        row.c[7]?.v || 0,

      stock:
        row.c[8]?.v || 0,

      available:
        row.c[9]?.v || "",

      lastUpdated:
        row.c[10]?.v || "",

      freshness:
        row.c[11]?.v || "",

      location:
        row.c[12]?.v || "",

      mapsLink:
        row.c[13]?.v || "",

      shopPhone:
        row.c[14]?.v || "",

      shopLat:
        row.c[15]?.v || null,

      shopLng:
        row.c[16]?.v || null
    }));

  lastFetchTime =
    Date.now();

  return inventoryCache;

} catch (error) {

  console.log(
    "Inventory fetch failed:"
  );

  console.log(error.message);

  // FALLBACK TO CACHE

  if (
    inventoryCache.length
  ) {

    return inventoryCache;
  }

  return [];
}
}

async function refreshInventoryCache() {

  console.log(
    "Auto refreshing inventory..."
  );

  try {

    await getInventory();

    console.log(
      "Inventory refreshed"
    );

  } catch (error) {

    console.log(
      "Auto refresh failed"
    );

    console.log(
      error.message
    );
  }
}

async function getBrands() {
  const inventory =
    await getInventory();

  return [
    ...new Set(
      inventory.map(
        item => item.brand
      )
    )
  ];
}

async function getModels(
  brand
) {
  const inventory =
    await getInventory();

  return [
    ...new Set(
      inventory
        .filter(
          item =>
            item.brand === brand
        )
        .map(
          item => item.model
        )
    )
  ];
}

module.exports = {
  getInventory,
  getBrands,
  getModels,
  refreshInventoryCache
};