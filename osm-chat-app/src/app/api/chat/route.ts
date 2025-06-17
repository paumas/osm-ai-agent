import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Document } from 'langchain/document';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { FakeEmbeddings } from 'langchain/embeddings/fake'; // Placeholder
import { MemoryVectorStore } from 'langchain/vectorstores/memory'; // Placeholder
import { RetrievalQAChain } from 'langchain/chains'; // Placeholder for actual chain
import { ChatOpenAI } from '@langchain/openai'; // Placeholder LLM

// Basic configuration for the placeholder LLM
const llm = new ChatOpenAI({ apiKey: 'sk-fake', modelName: 'gpt-3.5-turbo' }); // Placeholder

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required and must be a string' }, { status: 400 });
    }

    // 1. Load Documents from /data directory
    const dataDir = path.join(process.cwd(), 'data');
    const filenames = fs.readdirSync(dataDir);
    const docs: Document[] = [];

    for (const filename of filenames) {
      if (filename.endsWith('.md')) {
        const filePath = path.join(dataDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { content, data: metadata } = matter(fileContents); // Using gray-matter
        docs.push(new Document({ pageContent: content, metadata: { source: filename, ...metadata } }));
      }
    }

    if (docs.length === 0) {
      return NextResponse.json({ error: 'No markdown documents found in /data directory' }, { status: 500 });
    }

    // 2. Split Documents
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 200,
    });
    const splits = await textSplitter.splitDocuments(docs);

    // 3. Embeddings and Vector Store (Using Placeholders)
    const embeddings = new FakeEmbeddings();
    const vectorStore = await MemoryVectorStore.fromDocuments(splits, embeddings);

    // 4. Retriever
    const retriever = vectorStore.asRetriever();

    // 5. Chain (Using a simple RetrievalQAChain with a placeholder LLM)
    // For now, the "LLM" will effectively just use the retrieved documents or a similar mechanism.
    // A more sophisticated chain would involve prompting the LLM with context.
    const chain = RetrievalQAChain.fromLLM(llm, retriever, {
      returnSourceDocuments: true, // Optionally return source documents
    });

    // 6. Process query
    const result = await chain.invoke({ query: message });

    // For this placeholder version, let's just return the retrieved documents' content or a part of it.
    // A real LLM would generate a natural language response.
    const responseText = result.sourceDocuments && result.sourceDocuments.length > 0
      ? result.sourceDocuments.map((doc: Document) => `Source: ${doc.metadata.source}\n${doc.pageContent}`).join('\n\n---\n\n')
      : "No relevant information found with placeholder setup.";

    // The actual text response from the chain (if not using sourceDocuments directly)
    // const responseText = result.text;


    return NextResponse.json({
      reply: result.text, // This would be the LLM's answer
      // sources: result.sourceDocuments // Optionally send sources back to UI
    });

  } catch (error: any) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Failed to process chat message', details: error.message }, { status: 500 });
  }
}
