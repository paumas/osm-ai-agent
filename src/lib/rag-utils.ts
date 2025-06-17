import fs from 'fs/promises';
import path from 'path';
import { Document } from '@langchain/core/documents';
import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter';
import { OllamaEmbeddings } from '@langchain/ollama';
import { MemoryVectorStore } from "langchain/vectorstores/memory";

// Define a constant for the data directory
const DATA_DIR = path.join(process.cwd(), 'data');
const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || 'http://localhost:11434';
const OLLAMA_EMBEDDING_MODEL = process.env.OLLAMA_EMBEDDING_MODEL || 'bge-m3';

// Cache for the initialized vector store
let vectorStore: MemoryVectorStore | null = null;

async function loadAndProcessDocuments(): Promise<Document[]> {
  console.log('Loading and processing documents for RAG...');
  const documents: Document[] = [];
  try {
    // Check if data directory exists
    try {
      await fs.access(DATA_DIR);
    } catch (e) {
      console.warn(`RAG: Data directory not found: ${DATA_DIR}. No documents will be loaded.`, e);
      return [];
    }

    const files = await fs.readdir(DATA_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    if (markdownFiles.length === 0) {
      console.warn(`RAG: No .md files found in ${DATA_DIR}.`);
      return [];
    }

    for (const mdFile of markdownFiles) {
      const filePath = path.join(DATA_DIR, mdFile);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        // Each file is treated as a separate document, metadata can be added if needed
        documents.push(new Document({ pageContent: content, metadata: { source: mdFile } }));
      } catch (readError) {
        console.error(`RAG: Error reading file ${filePath}:`, readError);
      }
    }
    console.log(`RAG: Loaded ${documents.length} documents.`);
    return documents;
  } catch (error) {
    console.error('RAG: Error loading documents:', error);
    throw new Error('RAG: Failed to load documents.');
  }
}

export async function getVectorStore(): Promise<MemoryVectorStore> {
  if (vectorStore) {
    console.log('RAG: Returning cached vector store.');
    return vectorStore;
  }

  const embeddings = new OllamaEmbeddings({
    model: OLLAMA_EMBEDDING_MODEL,
    baseUrl: OLLAMA_BASE_URL,
  });

  console.log('RAG: Initializing new vector store...');
  const docs = await loadAndProcessDocuments();

  if (docs.length === 0) {
    console.warn('RAG: No documents loaded, initializing an empty vector store.');
    // Create an empty vector store; it's up to the calling code to handle it
    // For MemoryVectorStore, it can be initialized without documents directly
    vectorStore = new MemoryVectorStore(embeddings);
    return vectorStore;
  }

  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 1000, // Aim for chunks of this many characters
    chunkOverlap: 200, // Overlap between chunks
  });

  const splitDocs = await textSplitter.splitDocuments(docs);
  console.log(`RAG: Split into ${splitDocs.length} document chunks.`);

  try {
    console.log('RAG: Generating embeddings and creating vector store...');
    vectorStore = await MemoryVectorStore.fromDocuments(splitDocs, embeddings);
    console.log('RAG: Vector store initialized and cached.');
    return vectorStore;
  } catch (e) {
    console.error("RAG: Error creating vector store from documents", e)
    throw e;
  }
}

// Optional: Pre-warm the vector store when the module is loaded in a server environment
// This might not be ideal for all serverless environments, consider implications.
// getVectorStore().then(() => console.log('RAG: Vector store pre-warmed.')).catch(err => console.error('RAG: Error pre-warming vector store:', err));
