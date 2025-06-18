import { ollama} from "ollama-ai-provider";
import { streamText, CoreMessage, TextPart } from "ai";
import { getVectorStore } from "@/lib/rag-utils";

export const maxDuration = 30;

const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'mistral:7b-instruct';

export async function POST(req: Request) {
  const { messages }: { messages: CoreMessage[] } = await req.json();

  // Get the last user message as the query
  const userQuery = messages.findLast((m) => m.role === "user")?.content;
  const userText = (userQuery?.[0] as TextPart)?.text || '';

  if (!userQuery) {
    return new Response(JSON.stringify({ error: "No user query found" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  let retrievedContext = "";
  try {
    const vectorStore = await getVectorStore();
    if (vectorStore.memoryVectors.length > 0) { // Check if the vector store has been populated
        // Perform similarity search
        const results = await vectorStore.similaritySearch(userText, 2);

        if (results && results.length > 0) {
          retrievedContext = results
              .map((doc) => doc.pageContent)
              .join("\n\n---\n\n"); // Join results with a separator
          console.log("RAG: Retrieved context for query.");
        } else {
          console.log("RAG: No relevant context found for query.");
        }
    } else {
        console.log("RAG: Vector store is empty, proceeding without RAG context.");
    }
  } catch (error) {
    console.error("RAG: Error during context retrieval:", error);
    // Proceed without RAG context if retrieval fails
  }

  const systemPrompt = `
Tu esi OpenStreetMap (OSM) Lietuvoje žymėtojų bendruomenės AI asistentas.

Tavo tikslas – atsakyti į naudotojo klausimą tik remiantis pateiktu kontekstu.

Taisyklės:
1. Naudok tik kontekste pateiktą informaciją. Jei atsakymo nėra – taip ir pasakyk.
2. Atsakyk lietuviškai, aiškiai, struktūruotai.
3. Pateik atsakymą draugišku tonu, tarsi būtum bendruomenės narys.
4. Nurodyk šaltinį tokia forma: [Šaltinis: failas.md].

Jeigu atsakymo nėra kontekste, atsakyk:
„Deja, šios informacijos neradau tarp turimų dokumentų. Rekomenduoju paklausti OSM Talk LT bendruomenės forume: https://lists.openstreetmap.org/listinfo/talk-lt“

Svarbu: neinterpretuok ar nespėliok, jei trūksta aiškaus atsakymo.
`

  const messagesForOllama: CoreMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
      role: "user",
      content: `Kontekstas:\n${retrievedContext || "Konkretaus konteksto pagal šią užklausą negauta."}`,
    },
    {
        role: "user",
        content: userText,
    }
  ];

  const result = streamText({
    model: ollama(OLLAMA_MODEL),
    messages: messagesForOllama,
  });

  return result.toDataStreamResponse();
}