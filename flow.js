const {
  saveLead
} = require(
  "./leads"
);

const {
  getRecommendations
} = require(
  "./recommendations"
);

const {
  getBrands,
  getModels,
  getRam,
  getStorage,
  getColors,
  searchInventory
} = require("./inventoryHelpers");

const {
  formatResults
} = require("./formatter");

const {
  smartSearch
} = require("./smartSearch");

const {
  getNextStep
} = require("./steps");

const {
  getSession,
  resetSession,
  saveSession
} = require("./sessionStore");

const {
  trackSearch
} = require("./analytics");

async function sendNextStep(
  session,
  phone,
  sendListMessage
) {

  const nextStep =
    getNextStep(
      session.data
    );

  // DONE

  if (!nextStep) {

    const results =
      await searchInventory({
        brand:
          session.data.brand,

        model:
          session.data.model,

        ram:
          session.data.ram,

        storage:
          session.data.storage,

        color:
          session.data.color
      });

    return {
      done: true,
      results
    };
  }

  // MODEL

  if (nextStep === "model") {

    const models =
      await getModels(
        session.data.brand
      );

    session.models =
      models;

    session.step =
      "model_select";

    await sendListMessage(
      phone,
      "Choose Model",
      "Select Model",
      models
    );

    return {
      done: false
    };
  }

  // RAM

  if (nextStep === "ram") {

    const ramOptions =
      await getRam(
        session.data.brand,
        session.data.model
      );

    session.ramOptions =
      ramOptions;

    session.step =
      "ram_select";

    await sendListMessage(
      phone,
      "Choose RAM",
      "Select RAM",
      ramOptions
    );

    return {
      done: false
    };
  }

  // STORAGE

  if (
    nextStep ===
    "storage"
  ) {

    const storageOptions =
      await getStorage(
        session.data.brand,
        session.data.model,
        session.data.ram
      );

    session.storageOptions =
      storageOptions;

    session.step =
      "storage_select";

    await sendListMessage(
      phone,
      "Choose Storage",
      "Select Storage",
      storageOptions
    );

    return {
      done: false
    };
  }

  // COLOR

  if (
    nextStep ===
    "color"
  ) {

    const colorOptions =
      await getColors(
        session.data.brand,
        session.data.model,
        session.data.ram,
        session.data.storage
      );

    session.colorOptions =
      colorOptions;

    session.step =
      "color_select";

    await sendListMessage(
      phone,
      "Choose Color",
      "Select Color",
      colorOptions
    );

    return {
      done: false
    };
  }

  return {
    done: false
  };
}

async function handleFlow(
  phone,
  text,
  sendMessage,
  sendListMessage
) {

  console.log(
  "HANDLE FLOW STARTED"
);

  const session =
  await getSession(phone);

  console.log(
  "SESSION:",
  session
);

  text = text.trim();

  if (
  session.awaitingLead &&
  text.toLowerCase() ===
    "yes"
) {

  await saveLead({
    phone,

    brand:
      session.data.brand,

    model:
      session.data.model,

    ram:
      session.data.ram,

    storage:
      session.data.storage,

    color:
      session.data.color
  });

  session.awaitingLead =
    false;

  session.step =
  "brand";

session.data = {};

  await saveSession(
    phone,
    session
  );

  await sendMessage(
    phone,
    "✅ Seller will contact you shortly."
  );

  return;
}

  const recommendationKeywords = [
  "best",
  "cheap",
  "budget",
  "gaming",
  "camera",
  "under"
];

const isRecommendationQuery =
  recommendationKeywords.some(
    keyword =>
      text
        .toLowerCase()
        .includes(keyword)
  );

if (
  isRecommendationQuery
) {

  const recommendations =
    await getRecommendations(
      text
    );

  const formatted =
    formatResults(
      recommendations
    );

  await sendMessage(
    phone,
    `🤖 AI Recommendations\n\n${formatted}`
  );

await saveSession(
  phone,
  session
);


  return;
}

  if (
  session.step === "done"
) {

  session.step =
    "brand";

  session.data = {};

  session.lastSearch =
    null;

  await saveSession(
    phone,
    session
  );
}

  // RESET COMMANDS

const resetCommands = [
  "restart",
  "reset",
  "start over",
  "menu",
  "cancel"
];

if (
  resetCommands.includes(
    text.toLowerCase()
  )
) {

  session.step =
    "brand";

  session.data = {};

  session.lastSearch =
    null;

  await saveSession(
  phone,
  session
);

  await sendMessage(
    phone,
    "✅ Search restarted."
  );

  const brands =
    await getBrands();

  session.brands =
    brands;

  session.step =
    "brand_select";

    await saveSession(
  phone,
  session
);

  await sendListMessage(
    phone,
    "Choose Brand",
    "Select Brand",
    brands
  );

  return;
}


// SMART SEARCH

if (
  session.step === "brand"
) {

  const smartResults =
    await smartSearch(text);

  if (
    smartResults.length
  ) {

    await trackSearch({
      phone,

      searchType:
        "smart_search"
    });

    const formatted =
      formatResults(
        smartResults
      );

    await sendMessage(
  phone,
  formatted
);

session.step =
  "done";

    await saveSession(
      phone,
      session
    );

    return;
  }
}

  // START FLOW

  if (
    session.step === "brand"
  ) {

    const brands =
      await getBrands();

    session.step =
  "brand_select";

session.brands =
  brands;

  await saveSession(
  phone,
  session
);

await sendListMessage(
  phone,
  `📱 Welcome to StockNear

Find phones available near you instantly 🚀

Choose Brand`,
  "Select Brand",
  brands
);

return;
  }

  // BRAND SELECT

  if (
    session.step ===
    "brand_select"
  ) {

    const brands =
  await getBrands();

    const selectedBrand =
  text;

    if (
  !brands.includes(
    selectedBrand
  )
) {

      await sendMessage(
        phone,
        "Invalid brand."
      );

      return;
    }

    session.data.brand =
  selectedBrand;

const models =
  await getModels(
    selectedBrand
  );

session.step =
  "model_select";

session.models =
  models;

await saveSession(
  phone,
  session
);

await sendListMessage(
  phone,
  "Choose Model",
  "Select Model",
  models
);

return;
  }

  // MODEL SELECT

  if (
    session.step ===
    "model_select"
  ) {

    const models =
  await getModels(
    session.data.brand
  );

    const selectedModel =
  text;

    if (
  !models.includes(
    selectedModel
  )
) {

      await sendMessage(
        phone,
        "Invalid model."
      );

      return;
    }

    session.data.model =
  selectedModel;

const ramOptions =
  await getRam(
    session.data.brand,
    session.data.model
  );

session.step =
  "ram_select";

session.ramOptions =
  ramOptions;

await saveSession(
  phone,
  session
);

await sendListMessage(
  phone,
  "Choose RAM",
  "Select RAM",
  ramOptions
);

return;
  }

  // RAM SELECT

if (
  session.step ===
  "ram_select"
) {

  const ramOptions =
  await getRam(
    session.data.brand,
    session.data.model
  );

  const selectedRam =
  text;

  if (
  !ramOptions.includes(
    selectedRam
  )
) {

    await sendMessage(
      phone,
      "Invalid RAM option."
    );

    return;
  }

  session.data.ram =
  selectedRam;

const storageOptions =
  await getStorage(
    session.data.brand,
    session.data.model,
    session.data.ram
  );

session.step =
  "storage_select";

session.storageOptions =
  storageOptions;

await saveSession(
  phone,
  session
);

await sendListMessage(
  phone,
  "Choose Storage",
  "Select Storage",
  storageOptions
);

return;
}

// STORAGE SELECT

if (
  session.step ===
  "storage_select"
) {

  const storageOptions =
  await getStorage(
    session.data.brand,
    session.data.model,
    session.data.ram
  );

  const selectedStorage =
  text;

  if (
  !storageOptions.includes(
    selectedStorage
  )
) {

    await sendMessage(
      phone,
      "Invalid storage option."
    );

    return;
  }

  session.data.storage =
  selectedStorage;

const colorOptions =
  await getColors(
    session.data.brand,
    session.data.model,
    session.data.ram,
    session.data.storage
  );

session.step =
  "color_select";

session.colorOptions =
  colorOptions;

await saveSession(
  phone,
  session
);

await sendListMessage(
  phone,
  "Choose Color",
  "Select Color",
  colorOptions
);

return;
}

// COLOR SELECT

if (
  session.step ===
  "color_select"
) {

  const colorOptions =
  await getColors(
    session.data.brand,
    session.data.model,
    session.data.ram,
    session.data.storage
  );

  const selectedColor =
  text;

  if (
  !colorOptions.includes(
    selectedColor
  )
) {

    await sendMessage(
      phone,
      "Invalid color option."
    );

    return;
  }

  session.data.color =
  selectedColor;

  await trackSearch({
  phone,

  searchType:
    "guided_flow",

  brand:
    session.data.brand,

  model:
    session.data.model,

  ram:
    session.data.ram,

  storage:
    session.data.storage,

  color:
    session.data.color
});

const results =
  await searchInventory({
    brand:
      session.data.brand,

    model:
      session.data.model,

    ram:
      session.data.ram,

    storage:
      session.data.storage,

    color:
      session.data.color
  });

const formatted =
  formatResults(results);

await sendMessage(
  phone,
  formatted
);

session.step =
  "done";

await saveSession(
  phone,
  session
);

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