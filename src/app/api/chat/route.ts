import { ollama} from "ollama-ai-provider";
import { streamText, CoreMessage, TextPart } from "ai";
import { getVectorStore } from "@/lib/rag-utils";

export const maxDuration = 30;

const OLLAMA_MODEL = process.env.OLLAMA_MODEL || 'llama3.1:8b';

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
        const results = await vectorStore.similaritySearch(userText, 3);

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

const systemPrompt = `Esi Lietuvos OpenStreetMap (OSM) bendruomenės asistentas. Tavo užduotis - padėti žmonėms su OSM žymėjimu Lietuvoje.

KRITIŠKAI SVARBU:
1. Atsakyk TIK remiantis pateiktu kontekstu iš dokumentų
2. NIEKADA neišsigalvok informacijos, kuri nėra dokumentuose
3. Jei kontekste nėra atsakymo į klausimą, atsaky: "Deja, šios informacijos nerandu savo dokumentuose. Rekomenduoju užduoti šį klausimą OSM Talk LT bendruomenės forume: https://lists.openstreetmap.org/listinfo/talk-lt"
4. Visada nurodyk, iš kurio dokumento/šaltinio gavo informaciją (naudok [Šaltinis: failo_pavadinimas.md])
5. Atsakyk lietuvių kalba
6. Būk konkretus ir informatyvus

Kontekstas iš dokumentų:
${retrievedContext || "Konkretaus konteksto pagal šią užklausą negauta."}

Atsakymas (privalai nurodyti šaltinį):
`;

  const messagesForOllama: CoreMessage[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    {
        role: "user",
        content: `Vartotojo klausimas: ${userText}`,
    }
  ];

  const result = streamText({
    model: ollama(OLLAMA_MODEL),
    messages: messagesForOllama,
  });

  return result.toDataStreamResponse();
}