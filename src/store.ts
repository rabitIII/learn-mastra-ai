import { MDocument } from "@mastra/rag";
import { mastra } from "./mastra";
import { qwen } from "qwen-ai-provider";
import { EmbeddingModelV1 } from "@ai-sdk/provider";

// Load the paper
const paperUrl = "https://arxiv.org/html/1706.03762";
const response = await fetch(paperUrl);
const paperText = await response.text();
 
// Create document and chunk it
const doc = MDocument.fromText(paperText);
const chunks = await doc.chunk({
  strategy: "recursive",
  size: 512,
  overlap: 50,
  separator: "\n",
});
 
console.log("Number of chunks:", chunks.length);
// Number of chunks: 893

// Generate embeddings
const { embeddings } = await embedMany({
  model: qwen.textEmbeddingModel("text-embedding-v3"),
  values: chunks.map((chunk) => chunk.text),
});
 
// Get the vector store instance from Mastra
const vectorStore = mastra.getVector("pgVector");
 
// Create an index for our paper chunks
await vectorStore.createIndex({
  indexName: "papers",
  dimension: 1536,
});
 
// Store embeddings
await vectorStore.upsert({
  indexName: "papers",
  vectors: embeddings,
  metadata: chunks.map((chunk) => ({
    text: chunk.text,
    source: "transformer-paper",
  })),
});

function embedMany(arg0: { model: EmbeddingModelV1<string>; values: string[]; }): { embeddings: any; } | PromiseLike<{ embeddings: any; }> {
    throw new Error("Function not implemented.");
}
