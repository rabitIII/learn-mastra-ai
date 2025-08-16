import { createTool } from "@mastra/core";
import { readdir } from "node:fs/promises";
import path from "node:path";
import z from "zod";


export const readMdFiles = createTool({
    id: 'md-reader',
    description: '读取本地目录中的Markdown文件（.md），支持递归处理子目录',
    inputSchema: z.object(({
        dirPath: z.string().describe('要读取的目录路径')
    })),
    execute: async ({ context, runtimeContext }) => {
        const { dirPath } = context;
        try {
            const entries = await readdir(dirPath, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = path.join(dirPath, entry.name);

                if (entry.isDirectory()) {
                    // 递归处理子目录
                }
            }
        } catch(err) {
            console.error(err);
        }
    }
})

