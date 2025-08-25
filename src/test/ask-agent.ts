import { mastra } from "../mastra";

const askAgent = mastra.getAgent("researchAgent");

// Basic query about concepts
const query1 =
  "Hi，你是干什么的师傅?";
const response1 = await askAgent.generate(query1);
console.log("\nQuery:", query1);
console.log("Response:", response1.text);

const query2 = "那站长都会些什么?";
const response2 = await askAgent.generate(query2);
console.log("\nQuery:", query2);
console.log("Response:", response2.text);

const query3 = "有站长的联系方式吗，能否告知？";
const response3 = await askAgent.generate(query3);
console.log("\nQuery:", query2);
console.log("Response:", response2.text);
