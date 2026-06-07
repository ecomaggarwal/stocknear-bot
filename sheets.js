const axios = require("axios");
require("dotenv").config();

const SHEET_ID = process.env.SHEET_ID;
const SHEET_GID = process.env.SHEET_GID;

let inventoryCache = [];
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000;

async function getInventory() {

  const now = Date.now();

  if (inventoryCache.length && now - lastFetchTime < CACHE_DURATION) {
    console.log("Using inventory cache");
    return inventoryCache;
  }

  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&gid=${SHEET_GID}`;

  try {

    console.log("Fetching fresh inventory");

    const response = await axios.get(url);
    const text = response.data;
    const json = JSON.parse(text.substring(47).slice(0, -2));
    const rows = json.table.rows;

    inventoryCache = rows.map(row => ({
      shopId:      row.c[0]?.v  || "",
      shopName:    row.c[1]?.v  || "",
      brand:       row.c[2]?.v  || "",
      series:      row.c[3]?.v  || "",   // NEW
      model:       row.c[4]?.v  || "",   // shifted
      ram:         row.c[5]?.v  || "",   // shifted
      storage:     row.c[6]?.v  || "",   // shifted
      color:       row.c[7]?.v  || "",   // shifted
      price:       row.c[8]?.v  || 0,    // shifted
      stock:       row.c[9]?.v  || 0,    // shifted
      available:   row.c[10]?.v || "",   // shifted
      lastUpdated: row.c[11]?.v || "",   // shifted
      freshness:   row.c[12]?.v || "",   // shifted
      location:    row.c[13]?.v || "",   // shifted
      mapsLink:    row.c[14]?.v || "",   // shifted
      shopPhone:   row.c[15]?.v || "",   // shifted
      shopLat:     row.c[16]?.v || null, // shifted
      shopLng:     row.c[17]?.v || null  // shifted
    }));

    lastFetchTime = Date.now();
    return inventoryCache;

  } catch (error) {
    console.log("Inventory fetch failed:", error.message);
    if (inventoryCache.length) return inventoryCache;
    return [];
  }
}

async function refreshInventoryCache() {
  console.log("Auto refreshing inventory...");
  try {
    await getInventory();
    console.log("Inventory refreshed");
  } catch (error) {
    console.log("Auto refresh failed:", error.message);
  }
}

module.exports = {
  getInventory,
  refreshInventoryCache
};