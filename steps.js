const {
  getBrands,
  getModels,
  getRam,
  getStorage,
  getColors
} = require("./inventoryHelpers")

const steps = {
  brand: {
    next: "model",

    message: "Select Brand",

    getOptions: async () => {
      return await getBrands();
    },

    saveAs: "brand"
  },

  model: {
    next: "ram",

    message: "Select Model",

    getOptions: async (
      selections
    ) => {
      return await getModels(
        selections.brand
      );
    },

    saveAs: "model"
  },

  ram: {
    next: "storage",

    message: "Select RAM",

    getOptions: async (
      selections
    ) => {
      return await getRam(
        selections.brand,
        selections.model
      );
    },

    saveAs: "ram"
  },

  storage: {
    next: "color",

    message: "Select Storage",

    getOptions: async (
      selections
    ) => {
      return await getStorage(
        selections.brand,
        selections.model,
        selections.ram
      );
    },

    saveAs: "storage"
  },

  color: {
    next: "completed",

    message: "Select Color",

    getOptions: async (
      selections
    ) => {
      return await getColors(
        selections.brand,
        selections.model,
        selections.ram,
        selections.storage
      );
    },

    saveAs: "color"
  }
};

module.exports = steps;