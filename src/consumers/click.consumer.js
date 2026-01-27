// simulate a Kafka consumer
import { eventBus } from "../events/eventBus.js";
import { CLICK_EVENT } from "../events/click.events.js";
import Url from "../models/url.model.js";

eventBus.on(CLICK_EVENT, async ({ shortCode, clickedAt }) => {
  try {
    await Url.updateOne(
      { shortCode, isActive: true },
      {
        $inc: { clickCount: 1 },
        $set: { lastClickedAt: clickedAt },
      },
      { upsert: false },
    );
  } catch (err) {
    console.error("Click consumer failed:", err);
  }
});
