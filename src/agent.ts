import dotenv from "dotenv";
import {
  StateGraph,
  START,
  END,
  MessagesAnnotation,
  Annotation,
  MemorySaver,
} from "@langchain/langgraph";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import {
  FRAMES_CONTENT_EXTRACTION_TOOL,
  FRAMES_CONTENT_SUMMARY_TOOL,
} from "./constants";
import { frameContentExtraction } from "./tools/frameContentExtraction";
import { framesContentSummary } from "./tools/framesContentSummaryTool";
dotenv.config();

export const StateAnnotations = Annotation.Root({
  ...MessagesAnnotation.spec,
  frames: Annotation<HumanMessage[]>,
  answer: Annotation<AIMessage>,
});

const builder = new StateGraph(StateAnnotations)
  .addNode(FRAMES_CONTENT_EXTRACTION_TOOL, frameContentExtraction)
  .addNode(FRAMES_CONTENT_SUMMARY_TOOL, framesContentSummary)
  .addEdge(START, FRAMES_CONTENT_EXTRACTION_TOOL)
  .addEdge(FRAMES_CONTENT_EXTRACTION_TOOL, FRAMES_CONTENT_SUMMARY_TOOL)
  .addEdge(FRAMES_CONTENT_SUMMARY_TOOL, END);

const checkpointer = new MemorySaver();
export const graph = builder.compile({
  checkpointer,
});
