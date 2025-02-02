import dotenv from "dotenv";
import { ChatAnthropic } from "@langchain/anthropic";
import { StateAnnotations } from "../agent";
import { AIMessage, HumanMessage } from "@langchain/core/messages";
import {
  ANSWER_WITH_INSTRUCTION,
  FRAMES_CONTENT_SYNTHESIS_INTRUCTION,
  QUESTION_SUMMURISE_CONTEXT,
} from "../constants";
dotenv.config();

export async function framesContentSummary(
  _state: typeof StateAnnotations.State
) {
  const llm = new ChatAnthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
    model: "claude-2.1",
    temperature: 0.4,
  });

  const contextString = _state.messages
    .map((msg: HumanMessage) => msg.content)
    .join("\n");

  const refinedPrompt = `instructions:${FRAMES_CONTENT_SYNTHESIS_INTRUCTION} Context:${contextString} Question:${QUESTION_SUMMURISE_CONTEXT} Answer:${ANSWER_WITH_INSTRUCTION}`;
  const response = await llm.invoke([
    new HumanMessage({
      content: refinedPrompt,
    }),
  ]);

  return {
    message: response,
    answer: response.content,
  };
}
