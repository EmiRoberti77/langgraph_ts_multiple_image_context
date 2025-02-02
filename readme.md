# Multi-Image Context Extraction - README

## Overview

The Multi-Image Context Extraction system processes a series of images to extract relevant details and synthesize them into a coherent story. This system is implemented using **LangGraph**, **LangChain**, and **Anthropic Claude**, with OpenAI GPT-4o handling image-to-text extraction. The system is designed to run as a TypeScript-based agent and supports execution within a Docker container.

## Features

- **Processes multiple images in sequence** to extract meaningful content.
- **Synthesizes a unified story** from all extracted frames.
- **Uses LangGraph to manage flow** between content extraction and summarization.
- **Leverages OpenAI GPT-4o for image analysis** and **Claude 2.1 for final synthesis**.
- **Modular and extensible**, allowing easy addition of new processing tools.

## Architecture

### 1. Graph-based Processing (`agent.ts`)

The system is structured as a LangGraph pipeline, with the following key nodes:

- `FRAMES_CONTENT_EXTRACTION_TOOL`: Extracts content from each image.
- `FRAMES_CONTENT_SUMMARY_TOOL`: Generates a final synthesized story from extracted content.

Graph Structure:

```ts
const builder = new StateGraph(StateAnnotations)
  .addNode(FRAMES_CONTENT_EXTRACTION_TOOL, frameContentExtraction)
  .addNode(FRAMES_CONTENT_SUMMARY_TOOL, framesContentSummary)
  .addEdge(START, FRAMES_CONTENT_EXTRACTION_TOOL)
  .addEdge(FRAMES_CONTENT_EXTRACTION_TOOL, FRAMES_CONTENT_SUMMARY_TOOL)
  .addEdge(FRAMES_CONTENT_SUMMARY_TOOL, END);
```

### 2. Running the Graph (`runGraph.ts`)

- Initializes and feeds image URLs for processing.
- Invokes the graph execution with an initial state.
- Outputs extracted text and a final synthesized story.

### 3. Frame Content Extraction (`frameContentExtraction.ts`)

- Uses OpenAI GPT-4o to extract textual descriptions from each frame.

```ts
await Promise.allSettled(
  _state.frames.map(async (frame: HumanMessage) => {
    const oaixResponse = await OAIXImageHandler.processImage(frame.content);
    _state.messages.push(new AIMessage({ content: oaixResponse.text }));
  })
);
```

### 4. Frames Content Summary (`framesContentSummaryTool.ts`)

- Uses **Claude 2.1** to generate a cohesive story from extracted content.

```ts
const refinedPrompt = `instructions:${FRAMES_CONTENT_SYNTHESIS_INTRUCTION} \n
Context:${contextString} \n
Question:${QUESTION_SUMMURISE_CONTEXT} \n
Answer:${ANSWER_WITH_INSTRUCTION}`;
```

### 5. Image Processing Handler (`oaixImgHandler.ts`)

- Converts images to base64 and sends them to OpenAI for analysis.

```ts
const response = await openai.chat.completions.create({
  model: "gpt-4o",
  messages: [
    {
      role: "user",
      content: [
        { type: "text", text: contextDescription },
        {
          type: "image_url",
          image_url: { url: `data:image/jpeg;base64,${base64Frame}` },
        },
      ],
    },
  ],
});
```

### 6. Running the Graph with Sample Data

```ts
async function startGraph() {
  const state = {
    frames: [
      new HumanMessage({ content: frames[0] }),
      new HumanMessage({ content: frames[1] }),
      ... // More frames
    ],
    answer: new AIMessage({ content: "" }),
    messages: [],
  };

  const response = await graph.invoke(state, {
    configurable: {
      thread_id: "oaix_1",
    },
  });
  console.log(response);
}
startGraph();
```

## Execution

### Running Locally

```sh
node runGraph.ts
```

### Running in Docker

#### Build the Image

```sh
docker build -t multi-image-context .
```

#### Run the Container

```sh
docker run --rm -it multi-image-context
```

## Expected Output

- JSON object with extracted text per frame.
- A final synthesized story summarizing the image sequence.

## Summary

This system uses LangGraph, OpenAI GPT-4o, and Anthropic Claude to extract and synthesize contextual information from multiple images into a unified narrative. It runs as a structured LangChain agent and is containerized for seamless deployment.
