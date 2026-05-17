const express = require("express");

const {
  sendMessage,
  sendListMessage
} = require("./send");

const {
  getBrands,
  getModels,
  getRam,
  getStorage,
  getColors,
  searchInventory,
  handleFlow
} = require("./flow");

const {
  createSession,
  getSession,
  updateSession
} = require("./sessions");

const { formatResults } = require("./formatter");

const {
  formatOptions,
  createListMessage,
  parseOptionId
} = require("./whatsapp");

const {
  smartSearch
} = require("./smartSearch");

const steps =
  require("./steps");

const {
  getAnalytics,
  getSummary
} = require("./analytics");

const supabase =
  require("./supabase");

const {
  refreshInventoryCache
} = require(
  "./sheets"
);

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("StockNear Backend Running 🚀");
});

app.get("/brands", async (req, res) => {
  res.json(await getBrands());
});

app.get(
  "/models/:brand",
  async (req, res) => {
    res.json(
      await getModels(
        req.params.brand
      )
    );
  }
);

app.get(
  "/ram/:brand/:model",
  async (req, res) => {
    res.json(
      await getRam(
        req.params.brand,
        req.params.model
      )
    );
  }
);

app.get(
  "/storage/:brand/:model/:ram",
  async (req, res) => {
    res.json(
      await getStorage(
        req.params.brand,
        req.params.model,
        req.params.ram
      )
    );
  }
);

app.get(
  "/colors/:brand/:model/:ram/:storage",
  async (req, res) => {
    res.json(
      await getColors(
        req.params.brand,
        req.params.model,
        req.params.ram,
        req.params.storage
      )
    );
  }
);

app.get("/search", async (req, res) => {
  const results = await searchInventory(
    req.query
  );

  res.json(results);
});

app.get("/start/:userId", async (req, res) => {
  const userId = req.params.userId;

createSession(userId);

const currentStep =
  steps.brand;

const options =
  await currentStep.getOptions();

const formattedOptions =
  formatOptions(
    options,
    "brand"
  );

const payload =
  createListMessage({
    title:
      "Welcome to StockNear 👋\n\nSelect Brand",

    buttonText: "Choose Brand",

    options: formattedOptions
  });

res.json(payload);
});

app.get(
  "/select/:userId",
  async (req, res) => {
    const userId =
      req.params.userId;

    const rawChoice =
      req.query.choice;

    const choice =
      parseOptionId(rawChoice);

    const session =
      getSession(userId);

    if (!session) {
      return res.json({
        error:
          "Session not found"
      });
    }

    const currentStepKey =
      session.step;

    const currentStep =
      steps[currentStepKey];

    const selections =
      session.selections;

    // SAVE USER CHOICE
    selections[
      currentStep.saveAs
    ] = choice;

    // FINAL STEP
    if (
      currentStep.next ===
      "completed"
    ) {
      const results =
        await searchInventory(
          selections
        );

      const formatted =
        formatResults(results);

      updateSession(userId, {
        step: "completed",
        selections
      });

      return res.send(
        formatted
      );
    }

    // MOVE TO NEXT STEP
    const nextStepKey =
      currentStep.next;

    const nextStep =
      steps[nextStepKey];

    updateSession(userId, {
      step: nextStepKey,
      selections
    });

    const options =
      await nextStep.getOptions(
        selections
      );

    const formattedOptions =
      formatOptions(
        options,
        nextStepKey
      );

    const payload =
      createListMessage({
        title:
          nextStep.message,

        buttonText:
          `Choose ${nextStepKey}`,

        options:
          formattedOptions
      });

    res.json(payload);
  }
);

app.get("/send-test", async (req, res) => {
  await sendMessage(
    "918882077169",
    "Hello from StockNear 🚀"
  );

  res.send("Message sent");
});

app.get("/webhook", (req, res) => {

  const mode =
    req.query["hub.mode"];

  const token =
    req.query["hub.verify_token"];

  const challenge =
    req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === process.env.VERIFY_TOKEN
  ) {

    return res
      .status(200)
      .send(challenge);
  }

  res.sendStatus(403);
});

app.post("/webhook", async (req, res) => {

  try {

    const message =
      req.body.entry?.[0]?.changes?.[0]?.value?.messages?.[0];

    if (!message) {
      return res.sendStatus(200);
    }

    const from = message.from;

    let text = "";

if (message.text) {

  text =
    message.text.body
      .trim();

}

else if (
  message.interactive?.list_reply
) {

  text =
    message.interactive
      .list_reply.id;

}

    console.log("Message from:", from);
    console.log("Text:", text);

    try {

  await handleFlow(
    from,
    text,
    sendMessage,
    sendListMessage
  );

} catch (error) {

  console.log(
    "FLOW ERROR:",
    error
  );

  console.log(error);

  await sendMessage(
    from,
    "⚠️ Something went wrong. Please try again."
  );
}

    res.sendStatus(200);

  } catch (error) {

    console.log(error);

    res.sendStatus(500);
  }

});

app.get("/test-list", async (req, res) => {

  await sendListMessage(
    "918882077169",
    "Choose Brand",
    "Select",
    [
      "Apple",
      "Samsung",
      "Vivo"
    ]
  );

  res.send("List sent");
});

app.get(
  "/smart-search",
  async (req, res) => {

    const result =
      await smartSearch(
        req.query.q
      );

    res.json(result);
  }
);

app.get(
  "/analytics",
  async (req, res) => {

    res.json(
      await getAnalytics()
    );
  }
);

app.get(
  "/analytics-summary",
  async (req, res) => {

    res.json(
  await getSummary()
);
  }
);

app.get(
  "/supabase-test",
  async (req, res) => {

    res.json({
      connected: true
    });
  }
);

const PORT = 3000;

// REFRESH INVENTORY
// EVERY 5 MINUTES

setInterval(
  refreshInventoryCache,
  5 * 60 * 1000
);

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});