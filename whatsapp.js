function formatOptions(options, type) {
  return options.map(option => ({
    id: `${type}_${option}`
      .toLowerCase()
      .replace(/\s+/g, "_"),

    title: option
  }));
}

function createListMessage({
  title,
  buttonText,
  options
}) {
  return {
    type: "interactive",

    interactive: {
      type: "list",

      header: {
        type: "text",
        text: "StockNear"
      },

      body: {
        text: title
      },

      footer: {
        text: "Find nearby mobile stock instantly"
      },

      action: {
        button: buttonText,

        sections: [
          {
            title: "Options",

            rows: options.map(option => ({
              id: option.id,
              title: option.title
            }))
          }
        ]
      }
    }
  };
}

function parseOptionId(id) {
  const parts = id.split("_");

  parts.shift();

  return parts.join(" ");
}

module.exports = {
  formatOptions,
  createListMessage,
  parseOptionId
};