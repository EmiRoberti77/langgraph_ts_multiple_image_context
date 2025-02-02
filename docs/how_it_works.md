# Multi-Image Context Extraction System

## Overview

This project processes multiple images to extract meaningful context and synthesize them into a coherent story. It utilizes **LangGraph**, **LangChain**, and **Anthropic Claude** for AI-powered content extraction. The project is structured as a TypeScript-based agent and runs within a Docker container.

## Architecture

1. **Graph-based Processing:** The system uses `StateGraph` from LangGraph to define a sequence of nodes for processing frames and synthesizing extracted content.
2. **Image Processing:** Frames are processed using OpenAI’s GPT-4o to analyze images and extract meaningful content.
3. **Content Summarization:** Extracted frame data is synthesized into a unified narrative using Anthropic Claude.
4. **State Management:** The agent maintains a structured state that holds processed image content and generated messages.

## Components

### 1. Agent Setup (`agent.ts`)

- Defines the LangGraph processing pipeline.
- Uses `StateGraph` to add processing nodes:
  - `FRAMES_CONTENT_EXTRACTION_TOOL` (Extracts data from images).
  - `FRAMES_CONTENT_SUMMARY_TOOL` (Synthesizes the final story).
- **Nodes & Edges:**
  ```ts
  const builder = new StateGraph(StateAnnotations)
    .addNode(FRAMES_CONTENT_EXTRACTION_TOOL, frameContentExtraction)
    .addNode(FRAMES_CONTENT_SUMMARY_TOOL, framesContentSummary)
    .addEdge(START, FRAMES_CONTENT_EXTRACTION_TOOL)
    .addEdge(FRAMES_CONTENT_EXTRACTION_TOOL, FRAMES_CONTENT_SUMMARY_TOOL)
    .addEdge(FRAMES_CONTENT_SUMMARY_TOOL, END);
  ```

### 2. Running the Graph (`runGraph.ts`)

- Initializes the agent and feeds image URLs for processing.
- Starts execution using `graph.invoke()` with a structured initial state.

### 3. Frame Content Extraction (`frameContentExtraction.ts`)

- Iterates over images and extracts meaningful content using OpenAI GPT-4o.
- Uses `OAIXImageHandler.processImage()` to process each frame.
  ```ts
  await Promise.allSettled(
    _state.frames.map(async (frame: HumanMessage) => {
      const oaixResponse = await OAIXImageHandler.processImage(frame.content);
      _state.messages.push(new AIMessage({ content: oaixResponse.text }));
    })
  );
  ```

### 4. Frames Content Summary (`framesContentSummaryTool.ts`)

- Uses **Claude 2.1** to synthesize all extracted content into a final coherent story.
- Constructs a structured prompt combining extracted frame descriptions.
  ```ts
  const refinedPrompt = `instructions:${FRAMES_CONTENT_SYNTHESIS_INTRUCTION}
  Context:${contextString}
  Question:${QUESTION_SUMMURISE_CONTEXT}
  Answer:${ANSWER_WITH_INSTRUCTION}`;
  ```

### 5. Image Processing Handler (`oaixImgHandler.ts`)

- Downloads images from URLs, converts them to **base64**, and sends them to OpenAI GPT-4o for image-to-text analysis.
- Returns structured data including extracted text and image metadata.
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

### 6. Image Processing Response Model (`oaixImageHandlerResponse.ts`)

- Defines the response format for processed images.
- Includes extracted text, success flag, and optional embedding data.

## Execution

### Running the Graph

```sh
node runGraph.ts
```

### Expected Output

- A JSON object containing extracted text per frame.
- A final synthesized summary describing the overall context of the frames.

## Deployment (Docker)

### Build the Docker Image

```sh
docker build -t multi-image-context .
```

### Run the Container

```sh
docker run --rm -it multi-image-context
```

## Summary

This system is using LangGraph, OpenAI GPT-4o, and Anthropic Claude to process images, extract information, and generate a cohesive narrative. It operates as a structured LangChain agent and is containerized for easy deployment.
