import { NodeInterrupt } from "@langchain/langgraph";
import { StateAnnotations } from "../agent";
import { NODE_FRAME_SOURCE_NOT_FOUND } from "../constants";
import { OAIXImageHandler } from "../oaix/oaixImgHandler";

export async function frameContentExtraction(
  _state: typeof StateAnnotations.State
) {
  console.log("_state", _state);
  console.log("frame", _state.frames.content as string);
  const frame = _state.frames.content as string;
  if (!frame) {
    throw new NodeInterrupt(NODE_FRAME_SOURCE_NOT_FOUND);
  }

  const oaixResponse = await OAIXImageHandler.processImage(frame);
  return {
    messages: oaixResponse.text,
  };
}
