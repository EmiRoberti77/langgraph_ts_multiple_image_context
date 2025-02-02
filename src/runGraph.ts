import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { graph } from "./agent";

const frames = [
  "https://oaix-image-in-dev.s3.us-east-1.amazonaws.com/32767/frame_0001.jpg",
  "https://oaix-image-in-dev.s3.us-east-1.amazonaws.com/32767/frame_0002.jpg",
  "https://oaix-image-in-dev.s3.us-east-1.amazonaws.com/32767/frame_0003.jpg",
  "https://oaix-image-in-dev.s3.us-east-1.amazonaws.com/32767/frame_0004.jpg",
  "https://oaix-image-in-dev.s3.us-east-1.amazonaws.com/32767/frame_0005.jpg",
  "https://oaix-image-in-dev.s3.us-east-1.amazonaws.com/32767/frame_0006.jpg",
  "https://oaix-image-in-dev.s3.us-east-1.amazonaws.com/32767/frame_0007.jpg",
  "https://oaix-image-in-dev.s3.us-east-1.amazonaws.com/32767/frame_0008.jpg",
  "https://oaix-image-in-dev.s3.us-east-1.amazonaws.com/32767/frame_0009.jpg",
  "https://oaix-image-in-dev.s3.us-east-1.amazonaws.com/32767/frame_0010.jpg",
];

async function startGraph() {
  const state = {
    frames: [
      new HumanMessage({
        content: frames[0],
      }),
      new HumanMessage({
        content: frames[1],
      }),
      new HumanMessage({
        content: frames[2],
      }),
      new HumanMessage({
        content: frames[3],
      }),
      new HumanMessage({
        content: frames[4],
      }),
      new HumanMessage({
        content: frames[5],
      }),
      new HumanMessage({
        content: frames[6],
      }),
      new HumanMessage({
        content: frames[7],
      }),
      new HumanMessage({
        content: frames[8],
      }),
      new HumanMessage({
        content: frames[9],
      }),
    ],

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
