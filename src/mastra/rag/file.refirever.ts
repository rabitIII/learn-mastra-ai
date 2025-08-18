import { MDocument } from "@mastra/rag";
import { getFile } from "../tools/md-reader.tool";
import { embedMany } from "ai";
import { qwen } from "qwen-ai-provider";
import { mastra } from "..";
import { text } from "stream/consumers";


const contents = await getFile();

for (const content of contents) {
    const doc = MDocument.fromMarkdown(content);
    // console.log(doc);

    const chunks = await doc.chunk({
        strategy: "markdown",
        size: 512,
        overlap: 50,
        separator: "\n",
    });

    const { embeddings } = await embedMany({
        values: chunks.map((chunk)=> chunk.text),
        model: qwen.textEmbeddingModel("text-embedding-v3"),
    })

    const vectorStore = mastra.getVector("pgVector");

    await vectorStore.createIndex({
        indexName: "resume",
        dimension: 1024,
    });

    await vectorStore.upsert({
        indexName: "resume",
        vectors: embeddings,
        metadata: chunks.map((chunk) => ({
            text: chunk.text,
        }))
    })

}