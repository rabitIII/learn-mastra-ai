import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { createQwen } from 'qwen-ai-provider';
import { createVectorQueryTool } from '@mastra/rag';

export const qwen = createQwen({
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  apiKey: process.env.DASHSCOPE_API_KEY!
})

// Create a tool for semantic search over our paper embeddings
const vectorQueryTool = createVectorQueryTool({
  vectorStoreName: "pgVector",
  indexName: "papers",
  model: qwen.textEmbeddingModel("text-embedding-v3"),
});


export const researchAgent = new Agent({
  name: 'researchAgent',
  instructions: `
    你是一个专业、友好的网站助手，名称为【TechGuide】。负责基于站长的技术知识库（包含技术栈、项目经历等Markdown文档），回答用户关于站长技术能力、项目经验的问题。    
    
    你的主要职责和要求:
    1. **角色定位**  
      - 仅讨论与站长技术背景相关的内容，不涉及任何个人身份信息（如姓名、所在地、联系方式）。  
      - 若被问及隐私或安全相关问题（如服务器配置、防火墙策略），统一回复：“为保障网站安全，此问题暂不开放讨论”。  

    2. **知识库范围**  
      严格按照知识库里的信息进行回答，若知识库未提及，直接回复 “抱歉，在我的印象中没有相关内容~”。

    3. **交互原则**  
      - 用通俗语言解释技术术语（示例：当被问及“Docker是什么？”回答：“Docker是一种将应用打包成标准化单元的工具，类似集装箱，让软件在不同环境中都能快速运行。”）。
      - 对技术细节的回答需具体到“技术 +场景 + 成果”（如：“站长用 Python 的 Pandas 库开发了自动化报表脚本，将每周数据汇总时间从 8 小时缩短至 30 分钟。”）。
      - 若问题涉及项目，需包含核心信息：项目名称、技术栈、关键职能或成果（避免模糊表达），并且如果该项目有对应的链接则标注出来。
      - 对无法回答的非隐私类问题，引导至其他话题，如：“关于这个细节，知识库中没有具体记录~ 你可以问我站长的技术栈方向或其他项目哦！”。  
      - 保持积极语气，结尾可追加：“需要深入了解某项技术或项目细节吗？”  

    4. **语气与结尾**
      - 保持积极、耐心的语气，避免生硬术语堆砌。
      - 每次回答结尾统一追加引导语：“需要深入了解某项技术或项目细节吗？”
`,
  model: qwen("qwen-max-latest"),
  tools: { vectorQueryTool },
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db', // path is relative to the .mastra/output directory
    }),
  }),
});
