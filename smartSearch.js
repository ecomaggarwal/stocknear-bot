const stringSimilarity =
  require(
    "string-similarity"
  );

const {
  getInventory
} = require("./sheets");

const {
  searchInventory
} = require(
  "./inventoryHelpers"
);

function normalize(text) {
  return String(text)
    .toLowerCase()
    .replace(/\s+/g, "")
    .trim();
}

function findBestMatch(
  input,
  options
) {

  const normalizedOptions =
    options.map(
      option =>
        normalize(option)
    );

  const match =
    stringSimilarity
      .findBestMatch(
        normalize(input),
        normalizedOptions
      );

  if (
    match.bestMatch.rating >
    0.4
  ) {

    const index =
      normalizedOptions.indexOf(
        match.bestMatch.target
      );

    return options[index];
  }

  return null;
}

async function smartSearch(query) {

  const inventory =
    await getInventory();

  const text =
    normalize(query);

  let detected = {
    brand: null,
    model: null,
    ram: null,
    storage: null,
    color: null
  };

  // BRAND

  const brands =
    [...new Set(
      inventory.map(
        item => item.brand
      )
    )];

  detected.brand =
  findBestMatch(
    text,
    brands
  );

  // MODEL

  // MODEL

const models =
  [...new Set(
    inventory.map(
      item => item.model
    )
  )];

detected.model =
  findBestMatch(
    text,
    models
  );

if (
  detected.model &&
  !detected.brand
) {

  const matchedItem =
    inventory.find(
      item =>
        item.model ===
        detected.model
    );

  if (matchedItem) {
    detected.brand =
      matchedItem.brand;
  }
}

  // RAM

  // RAM

const ramOptions =
  [...new Set(
    inventory.map(
      item => item.ram
    )
  )];

for (const ram of ramOptions) {

  const ramValue =
    normalize(ram);

  const regex =
    new RegExp(
      `\\b${ramValue}\\b`
    );

  if (
    regex.test(text)
  ) {
    detected.ram =
      ram;

    break;
  }
}

  // STORAGE

  const storageOptions =
    [...new Set(
      inventory.map(
        item => item.storage
      )
    )];

  for (
    const storage of
    storageOptions
  ) {

    if (
      text.includes(
        normalize(storage)
      )
    ) {
      detected.storage =
        storage;

      break;
    }
  }

  // COLOR

  const colors =
    [...new Set(
      inventory.map(
        item => item.color
      )
    )];

  detected.color =
  findBestMatch(
    text,
    colors
  );

  const results =
  await searchInventory({
    brand:
      detected.brand,

    model:
      detected.model ||
      "Any Model",

    ram:
      detected.ram ||
      "Any RAM",

    storage:
      detected.storage ||
      "Any Storage",

    color:
      detected.color ||
      "Any Color"
  });

return results;
}

module.exports = {
  smartSearch
};