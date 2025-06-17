# OSM Chat Assistant

This is a chat assistant for OpenStreetMap (OSM) related questions, built with Next.js, `assistant-ui`, and Langchain.js. It uses a Retrieval Augmented Generation (RAG) pipeline to answer questions based on Markdown files stored in the `/data` directory.

## Prerequisites

- Node.js (version 18.x or later recommended)
- npm or yarn
- An instance of Ollama running locally. Ensure you have pulled a model suitable for chat and embeddings (e.g., `ollama pull llama3` or another model of your choice).

## Setup

1.  **Clone the repository (if applicable) or ensure you are in the project root directory.**

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    # yarn install
    ```

3.  **Prepare your data:**
    - Add your Markdown files containing the knowledge base to the `data/` directory.

## Running the Application

1.  **Start the Next.js development server:**
    ```bash
    npm run dev
    # or
    # yarn dev
    ```
2.  Open your browser and navigate to `http://localhost:3000` (or the port specified in your console).

## How it Works

-   The frontend is built using `assistant-ui`.
-   When you send a message, the frontend calls the backend API at `/api/chat`.
-   The backend API route (`src/app/api/chat/route.ts`) uses a RAG pipeline:
    1.  Loads Markdown documents from the `/data` directory.
    2.  Splits them into chunks.
    3.  Generates embeddings for these chunks.
    4.  Stores them in a vector store.
    5.  Retrieves relevant chunks based on your query.
    6.  Uses an LLM (which you'll configure to be Ollama) to generate an answer based on the retrieved context.
-   The response is then displayed in the chat interface.
