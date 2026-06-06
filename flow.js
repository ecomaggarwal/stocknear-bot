const { saveLead } = require("./leads");
const { getRecommendations } = require("./recommendations");
const { getBrands, getModels, getRam, getStorage, getColors, searchInventory } = require("./inventoryHelpers");
const { formatResults } = require("./formatter");
const { smartSearch } = require("./smartSearch");
const { getNextStep } = require("./steps");
const { getSession, resetSession, saveSession } = require("./sessionStore");
const { trackSearch } = require("./analytics");
const { sortResultsByDistance, getAreaCoordinates } = require("./locationHelper");
const { ZONES } = require("./areaCoordinates");

// ── HELPER — Apply distance sorting ──────────────────────────────────────────

function applyLocationSort(results, session) {
  if (session.location && session.location.lat && session.location.lng) {
    return sortResultsByDistance(results, session.location.lat, session.location.lng);
  }
  return results;
}

// ── HELPER — Show brand list ──────────────────────────────────────────────────

async function showBrandList(phone, session, sendListMessage, saveSession) {
  const { primary, secondary } = await getBrands();

  session.primaryBrands = primary;
  session.secondaryBrands = secondary;
  session.step = "brand_select";

  await saveSession(phone, session);

  await sendListMessage(
    phone,
    "📱 Choose Brand",
    "Select Brand",
    [...primary, "View More Brands"]
  );
}

// ── MAIN FLOW ─────────────────────────────────────────────────────────────────

async function handleFlow(phone, text, sendMessage, sendListMessage) {

  console.log("HANDLE FLOW STARTED");

  const session = await getSession(phone);

  console.log("SESSION:", session);

  text = text.trim();

  // ── STOP ──────────────────────────────────────────────────────────────────

  if (text.toLowerCase() === "stop") {
    session.step = "stopped";
    await saveSession(phone, session);
    await sendMessage(phone, "🛑 Chat stopped.\n\nSend Hi anytime to start again.");
    return;
  }

  if (session.step === "stopped") {
    session.step = "zone_select";
    session.data = {};
    session.location = null;
    await saveSession(phone, session);
  }

  // ── LEAD CAPTURE ──────────────────────────────────────────────────────────

  if (session.awaitingLead && text.toLowerCase() === "yes") {
    await saveLead({
      phone,
      brand: session.data.brand,
      model: session.data.model,
      ram: session.data.ram,
      storage: session.data.storage,
      color: session.data.color
    });

    session.awaitingLead = false;
    session.step = "zone_select";
    session.data = {};
    session.location = null;

    await saveSession(phone, session);
    await sendMessage(phone, "✅ Seller will contact you shortly.");
    return;
  }

  // ── RESET COMMANDS ────────────────────────────────────────────────────────

  const resetCommands = ["restart", "reset", "start over", "menu", "cancel"];

  if (resetCommands.includes(text.toLowerCase())) {
    session.step = "zone_select";
    session.data = {};
    session.location = null;

    await saveSession(phone, session);
    await sendMessage(phone, "✅ Search restarted.");

    const zoneNames = ZONES.map(z => z.zone);
    await sendListMessage(
      phone,
      "📍 Which zone are you in?\n\nSelect your area to find nearest shops",
      "Select Zone",
      zoneNames
    );
    return;
  }

  // ── DONE STATE ────────────────────────────────────────────────────────────

  if (session.step === "done") {
    session.step = "zone_select";
    session.data = {};
    session.location = null;
    session.lastSearch = null;
    await saveSession(phone, session);
  }

  // ── ZONE SELECT ───────────────────────────────────────────────────────────

  if (session.step === "zone_select") {

    const zoneNames = ZONES.map(z => z.zone);
    const matchedZone = ZONES.find(z => z.zone === text);

    if (matchedZone) {
      session.step = "area_select";
      session.data.selectedZone = matchedZone.zone;
      await saveSession(phone, session);

      await sendListMessage(
        phone,
        `📍 Which area in ${matchedZone.zone}?`,
        "Select Area",
        matchedZone.areas
      );
      return;
    }

    // Smart search fallback
    if (text.length > 0) {
      const smartResults = await smartSearch(text);
      if (smartResults.length) {
        await trackSearch({ phone, searchType: "smart_search" });
        const sorted = applyLocationSort(smartResults, session);
        const formatted = formatResults(sorted);
        await sendMessage(phone, formatted);
        session.step = "done";
        await saveSession(phone, session);
        return;
      }
    }

    // Show zone list
    await sendListMessage(
      phone,
      "📍 Which zone are you in?\n\nSelect your area to find nearest shops",
      "Select Zone",
      zoneNames
    );
    session.step = "zone_select";
    await saveSession(phone, session);
    return;
  }

  // ── AREA SELECT ───────────────────────────────────────────────────────────

  if (session.step === "area_select") {

    const selectedZone = ZONES.find(z => z.zone === session.data.selectedZone);

    if (!selectedZone) {
      session.step = "zone_select";
      await saveSession(phone, session);
      return;
    }

    const matchedArea = selectedZone.areas.find(a => a === text);

    if (!matchedArea) {
      await sendMessage(phone, "Invalid area. Please select from the list.");
      return;
    }

    const coords = getAreaCoordinates(matchedArea);

    session.location = {
      area: matchedArea,
      lat: coords ? coords.lat : null,
      lng: coords ? coords.lng : null
    };

    await saveSession(phone, session);

    await sendMessage(
      phone,
      `✅ Got it! Showing shops nearest to *${matchedArea}*\n\nNow let's find your phone! 📱`
    );

    await showBrandList(phone, session, sendListMessage, saveSession);
    return;
  }

  // ── RECOMMENDATION KEYWORDS ───────────────────────────────────────────────

  const recommendationKeywords = ["best", "cheap", "budget", "gaming", "camera", "under"];

  const isRecommendationQuery = recommendationKeywords.some(
    keyword => text.toLowerCase().includes(keyword)
  );

  if (isRecommendationQuery) {
    const recommendations = await getRecommendations(text);
    const sorted = applyLocationSort(recommendations, session);
    const formatted = formatResults(sorted);
    await sendMessage(phone, `🤖 AI Recommendations\n\n${formatted}`);
    await saveSession(phone, session);
    return;
  }

  // ── SMART SEARCH ──────────────────────────────────────────────────────────

  if (session.step === "brand") {
    const smartResults = await smartSearch(text);
    if (smartResults.length) {
      await trackSearch({ phone, searchType: "smart_search" });
      const sorted = applyLocationSort(smartResults, session);
      const formatted = formatResults(sorted);
      await sendMessage(phone, formatted);
      session.step = "done";
      await saveSession(phone, session);
      return;
    }
  }

  // ── START BRAND FLOW ──────────────────────────────────────────────────────

  if (session.step === "brand") {
    await showBrandList(phone, session, sendListMessage, saveSession);
    return;
  }

  // ── BRAND SELECT ──────────────────────────────────────────────────────────

  if (session.step === "brand_select") {

    const selectedBrand = text;

    // Handle "View More Brands"
    if (selectedBrand === "View More Brands") {
      await sendListMessage(
        phone,
        "📱 Choose Brand",
        "Select Brand",
        session.secondaryBrands || []
      );
      return;
    }

    const allBrands = [
      ...(session.primaryBrands || []),
      ...(session.secondaryBrands || [])
    ];

    if (!allBrands.includes(selectedBrand)) {
      await sendMessage(phone, "Invalid brand. Please select from the list.");
      return;
    }

    session.data.brand = selectedBrand;

    const models = await getModels(selectedBrand);
    session.step = "model_select";
    session.models = models;

    await saveSession(phone, session);

    await sendListMessage(phone, "Choose Model", "Select Model", models);
    return;
  }

  // ── MODEL SELECT ──────────────────────────────────────────────────────────

  if (session.step === "model_select") {

    const models = await getModels(session.data.brand);
    const selectedModel = text;

    if (!models.includes(selectedModel)) {
      await sendMessage(phone, "Invalid model.");
      return;
    }

    session.data.model = selectedModel;

    const ramOptions = await getRam(session.data.brand, session.data.model);
    session.step = "ram_select";
    session.ramOptions = ramOptions;

    await saveSession(phone, session);

    await sendListMessage(phone, "Choose RAM", "Select RAM", ramOptions);
    return;
  }

  // ── RAM SELECT ────────────────────────────────────────────────────────────

  if (session.step === "ram_select") {

    const ramOptions = await getRam(session.data.brand, session.data.model);
    const selectedRam = text;

    if (!ramOptions.includes(selectedRam)) {
      await sendMessage(phone, "Invalid RAM option.");
      return;
    }

    session.data.ram = selectedRam;

    const storageOptions = await getStorage(
      session.data.brand,
      session.data.model,
      session.data.ram
    );

    session.step = "storage_select";
    session.storageOptions = storageOptions;

    await saveSession(phone, session);

    await sendListMessage(phone, "Choose Storage", "Select Storage", storageOptions);
    return;
  }

  // ── STORAGE SELECT ────────────────────────────────────────────────────────

  if (session.step === "storage_select") {

    const storageOptions = await getStorage(
      session.data.brand,
      session.data.model,
      session.data.ram
    );

    const selectedStorage = text;

    if (!storageOptions.includes(selectedStorage)) {
      await sendMessage(phone, "Invalid storage option.");
      return;
    }

    session.data.storage = selectedStorage;

    const colorOptions = await getColors(
      session.data.brand,
      session.data.model,
      session.data.ram,
      session.data.storage
    );

    session.step = "color_select";
    session.colorOptions = colorOptions;

    await saveSession(phone, session);

    await sendListMessage(phone, "Choose Color", "Select Color", colorOptions);
    return;
  }

  // ── COLOR SELECT ──────────────────────────────────────────────────────────

  if (session.step === "color_select") {

    const colorOptions = await getColors(
      session.data.brand,
      session.data.model,
      session.data.ram,
      session.data.storage
    );

    const selectedColor = text;

    if (!colorOptions.includes(selectedColor)) {
      await sendMessage(phone, "Invalid color option.");
      return;
    }

    session.data.color = selectedColor;

    await trackSearch({
      phone,
      searchType: "guided_flow",
      brand: session.data.brand,
      model: session.data.model,
      ram: session.data.ram,
      storage: session.data.storage,
      color: session.data.color
    });

    const results = await searchInventory({
      brand: session.data.brand,
      model: session.data.model,
      ram: session.data.ram,
      storage: session.data.storage,
      color: session.data.color
    });

    const sorted = applyLocationSort(results, session);
    const formatted = formatResults(sorted);

    await sendMessage(phone, formatted);

    session.step = "done";
    await saveSession(phone, session);
    return;
  }
}

module.exports = {
  getBrands,
  getModels,
  getRam,
  getStorage,
  getColors,
  searchInventory,
  handleFlow
};