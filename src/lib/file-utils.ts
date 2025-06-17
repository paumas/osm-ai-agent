import fs from 'fs/promises';
import path from 'path';

// Define a constant for the data directory
const DATA_DIR = path.join(process.cwd(), 'data');

/**
 * Reads all markdown files from the data directory, concatenates their content,
 * and returns it as a single string.
 *
 * @returns {Promise<string>} A promise that resolves to the concatenated content
 *                            of all markdown files. Returns an empty string if
 *                            no .md files are found or if the data directory
 *                            doesn't exist.
 * @throws {Error} If there's an error reading the directory or any of the files,
 *                 excluding non-existence of the directory.
 */
export async function loadKnowledgeBase(): Promise<string> {
  try {
    // Check if data directory exists
    try {
      await fs.access(DATA_DIR);
    } catch {
      console.warn(`Data directory not found: ${DATA_DIR}. Returning empty knowledge base.`);
      return "";
    }

    const files = await fs.readdir(DATA_DIR);
    const markdownFiles = files.filter(file => file.endsWith('.md'));

    if (markdownFiles.length === 0) {
      console.warn(`No .md files found in ${DATA_DIR}. Returning empty knowledge base.`);
      return "";
    }

    let fullText = "";
    for (const mdFile of markdownFiles) {
      const filePath = path.join(DATA_DIR, mdFile);
      try {
        const content = await fs.readFile(filePath, 'utf-8');
        fullText += content + '\n\n'; // Add a separator between files
      } catch (readError) {
        console.error(`Error reading file ${filePath}:`, readError);
        // Optionally, decide if you want to throw an error or continue
        // For now, let's continue and just log the error
      }
    }
    return fullText.trim();
  } catch (error) {
    console.error('Error loading knowledge base:', error);
    // Depending on desired behavior, re-throw or return empty.
    // For now, re-throwing to make it visible if something unexpected happens.
    throw new Error('Failed to load knowledge base.');
  }
}
