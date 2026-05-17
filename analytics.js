const {
  trackSearch:
    saveAnalytics,

  getAnalytics:
    fetchAnalytics
} = require(
  "./analyticsStore"
);

async function trackSearch(
  data
) {

  await saveAnalytics({
    phone:
      data.phone ||

      null,

    brand:
      data.brand ||

      null,

    model:
      data.model ||

      null,

    ram:
      data.ram ||

      null,

    storage:
      data.storage ||

      null,

    color:
      data.color ||

      null,

    searchType:
      data.type ||

      "guided"
  });
}

async function getAnalytics() {

  const searches =
    await fetchAnalytics();

  return {
    searches
  };
}

async function getSummary() {

  const searches =
    await fetchAnalytics();

  const summary = {
    totalSearches: 0,

    smartSearches: 0,

    guidedSearches: 0,

    topBrands: {},

    topModels: {}
  };

  searches.forEach(
    search => {

      summary.totalSearches++;

      if (
        search.search_type ===
        "smart_search"
      ) {

        summary.smartSearches++;
      }

      if (
        search.search_type ===
        "guided_flow"
      ) {

        summary.guidedSearches++;
      }

      // TOP BRANDS

      if (search.brand) {

        if (
          !summary.topBrands[
            search.brand
          ]
        ) {

          summary.topBrands[
            search.brand
          ] = 0;
        }

        summary.topBrands[
          search.brand
        ]++;
      }

      // TOP MODELS

      if (search.model) {

        if (
          !summary.topModels[
            search.model
          ]
        ) {

          summary.topModels[
            search.model
          ] = 0;
        }

        summary.topModels[
          search.model
        ]++;
      }
    }
  );

  return summary;
}

module.exports = {
  trackSearch,
  getAnalytics,
  getSummary
};