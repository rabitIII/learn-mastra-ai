import { MDocument } from "@mastra/rag";
import { mastra } from "./mastra";
import { EmbeddingModelV1 } from "@ai-sdk/provider";
import { embedMany } from "ai";
import { promises as fs } from "node:fs";
import path from "node:path";
import { qwen } from "./mastra/agents/research-agent";


// 递归读取目录下的所有MD文件
const getMdFiles = async (dir: string): Promise<string[]> => {
  const files = await fs.readdir(dir);
  const mdFiles = [];

  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = await fs.stat(fullPath);

    if (stat.isDirectory()) {
      mdFiles.push(...await getMdFiles(fullPath));
    } else if (path.extname(file) === '.md') {
      mdFiles.push(fullPath);
    }
  }

  return mdFiles;
}

const mdFile = await getMdFiles('/home/yuetu/projects/my-mastra-app/md')


for (const text of mdFile) {
  // Create document and chunk it
  const doc = MDocument.fromMarkdown(text);
  const chunks = await doc.chunk({
    strategy: "recursive",
    size: 512,
    overlap: 50,
    separator: "\n",
  });

  console.log("Number of chunks:", chunks.length);

  // Generate embeddings [未完成]
  const { embeddings } = await embedMany({
    model: qwen.textEmbeddingModel("text-embedding-v3"),
    values: chunks.map((chunk) => chunk.text),
  });

  // Get the vector store instance from Mastra
  const vectorStore = mastra.getVector("pgVector");

  // Create an index for our paper chunks
  await vectorStore.createIndex({
    indexName: "papers",
    dimension: 1024,
  });

  // Store embeddings
  await vectorStore.upsert({
    indexName: "knowledge_base",
    vectors: embeddings.map((vec, i) => ({
      id: `${document[i].metadata.source}-$`
    })),
    metadata: chunks.map((chunk) => ({
      text: chunk.text,
      source: "transformer-paper",
    })),
  });
}
