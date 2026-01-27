// // simulate a Kafka consumer
// import { eventBus } from "../events/eventBus.js";
// import { CLICK_EVENT } from "../events/click.events.js";
// import Url from "../models/url.model.js";

// eventBus.on(CLICK_EVENT, async ({ shortCode, clickedAt }) => {
//   try {
//     await Url.updateOne(
//       { shortCode, isActive: true },
//       {
//         $inc: { clickCount: 1 },
//         $set: { lastClickedAt: clickedAt },
//       },
//       { upsert: false },
//     );
//   } catch (err) {
//     console.error("Click consumer failed:", err);
//   }
// });

import { consumer } from "../config/kafka.js";
import { TOPICS } from "../events/kafka.topics.js";
import Url from "../models/url.model.js";

export async function startClickConsumer() {
  await consumer.connect();

  await consumer.subscribe({
    topic: TOPICS.CLICK,
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const { shortCode, clickedAt } = JSON.parse(message.value.toString());

      await Url.updateOne(
        { shortCode, isActive: true },
        {
          $inc: { clickCount: 1 },
          $set: { lastClickedAt: new Date(clickedAt) },
        },
      );
    },
  });
}
