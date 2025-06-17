import { ollama } from "ollama-ai-provider";
import { streamText } from "ai";
export const maxDuration = 30;
export async function POST(req: Request) {
  const { messages } = await req.json();
  const ollamaModel = ollama("llama3");

  const result = streamText({
    model: ollamaModel,
    messages,
  });

  return result.toDataStreamResponse();
}