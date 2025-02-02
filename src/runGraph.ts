import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { graph } from "./agent";

async function startGraph() {
  const state = {
    frames: new HumanMessage({
      content:
        "https://oaix-image-in-dev.s3.us-east-1.amazonaws.com/32767/frame_0001.jpg",
    }),
    answer: new AIMessage({
      content: "",
    }),
    messages: [],
  };
  console.log(state);
  const response = await graph.invoke(state, {
    configurable: {
      thread_id: "oaix_1",
    },
  });
  console.log(response);
}
startGraph();
