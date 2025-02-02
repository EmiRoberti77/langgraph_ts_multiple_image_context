import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";
import { randomUUID } from "crypto";
import axios from "axios";
import { OAIXImageHandlerResponse } from "./model/oaixImageHandlerResponse";
import { FRAME_CONTEXT_DESCRIPTION } from "../constants";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

/**
 * Class to extract content out of the image from a url.
 * Image will be read back as a buffer and passed to
 * LLM for context
 */
export class OAIXImageHandler {
  /**
   * this method processes the frame and craetes the metadata for it,
   * @param source
   * @returns
   */
  public static async processImage(
    frameUrl: string,
    contextDescription: string = FRAME_CONTEXT_DESCRIPTION
  ): Promise<OAIXImageHandlerResponse> {
    const frameResponse = await axios.get(frameUrl, {
      responseType: "arraybuffer",
    });
    const base64Frame = Buffer.from(frameResponse.data, "binary").toString(
      "base64"
    );

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: contextDescription },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Frame}`,
              },
            },
          ],
        },
      ],
    });

    const text = response.choices[0].message.content
      ? response.choices[0].message.content
      : "no content";

    return {
      id: randomUUID(),
      success: true,
      imgPath: frameUrl,
      text,
      createdAt: new Date().toISOString(),
    };
  }
}
