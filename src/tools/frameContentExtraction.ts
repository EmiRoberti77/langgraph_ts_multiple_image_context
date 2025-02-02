import { NodeInterrupt } from "@langchain/langgraph";
import { StateAnnotations } from "../agent";
import { NODE_FRAME_SOURCE_NOT_FOUND } from "../constants";
import { OAIXImageHandler } from "../oaix/oaixImgHandler";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { messageToOpenAIRole } from "@langchain/openai";

export async function frameContentExtraction(
  _state: typeof StateAnnotations.State
) {
  console.log("_state", _state);
  //   if (!frame) {
  //     throw new NodeInterrupt(NODE_FRAME_SOURCE_NOT_FOUND);
  //   }
  await Promise.allSettled(
    _state.frames.map(async (frame: HumanMessage) => {
      const oaixResponse = await OAIXImageHandler.processImage(
        frame.content as string
      );
      _state.messages.push(new AIMessage({ content: oaixResponse.text }));
    })
  );

  return {
    messages: _state.messages,
  };
}
