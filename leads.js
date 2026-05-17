const supabase =
  require("./supabase");

async function saveLead(
  data
) {

  const {
    error
  } = await supabase
    .from("leads")
    .insert([
      {
        phone:
          data.phone,

        brand:
          data.brand,

        model:
          data.model,

        ram:
          data.ram,

        storage:
          data.storage,

        color:
          data.color
      }
    ]);

  if (error) {

    console.log(
      "Lead save error:",
      error.message
    );
  }
}

module.exports = {
  saveLead
};