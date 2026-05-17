const supabase =
  require("./supabase");

async function trackSearch(
  search
) {

  const {
    error
  } = await supabase
    .from("analytics")
    .insert([
      {
        phone:
          search.phone ||

          null,

        brand:
          search.brand ||

          null,

        model:
          search.model ||

          null,

        ram:
          search.ram ||

          null,

        storage:
          search.storage ||

          null,

        color:
          search.color ||

          null,

        search_type:
          search.searchType ||

          "guided"
      }
    ]);

  if (error) {

    console.log(
      "Analytics insert error:",
      error.message
    );
  }
}

async function getAnalytics() {

  const {
    data,
    error
  } = await supabase
    .from("analytics")
    .select("*")
    .order(
      "created_at",
      {
        ascending: false
      }
    );

  if (error) {

    console.log(
      "Analytics fetch error:",
      error.message
    );

    return [];
  }

  return data;
}

module.exports = {
  trackSearch,
  getAnalytics
};