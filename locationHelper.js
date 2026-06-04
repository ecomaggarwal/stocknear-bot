const {
  AREA_COORDINATES
} = require("./areaCoordinates");

// Haversine formula — calculates distance between two points in km
function getDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Get coordinates for a customer's selected area
function getAreaCoordinates(areaName) {
  return AREA_COORDINATES[areaName] || null;
}

// Sort shop results by distance from customer area
function sortResultsByDistance(results, customerLat, customerLng) {
  return results
    .map((item) => {
      const distanceKm =
        item.shopLat && item.shopLng
          ? getDistanceKm(
              customerLat,
              customerLng,
              parseFloat(item.shopLat),
              parseFloat(item.shopLng)
            )
          : null;
      return { ...item, distanceKm };
    })
    .sort((a, b) => {
      if (a.distanceKm === null) return 1;
      if (b.distanceKm === null) return -1;
      return a.distanceKm - b.distanceKm;
    });
}

// Format distance for display in WhatsApp message
function formatDistance(distanceKm) {
  if (distanceKm === null || distanceKm === undefined) return null;
  if (distanceKm < 1) return `${Math.round(distanceKm * 1000)}m away`;
  return `${distanceKm.toFixed(1)}km away`;
}

module.exports = {
  getDistanceKm,
  getAreaCoordinates,
  sortResultsByDistance,
  formatDistance
};