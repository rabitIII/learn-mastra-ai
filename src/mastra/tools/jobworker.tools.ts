import { createTool } from "@mastra/core";
import z from "zod";

interface CompanySearchResult {
    title: string;
    link: string;
    snippet: string;
    position: number;
    content: string;
}

interface UsageMetrics {
    search_count: number;
    rewrite_model: {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
    };
    filter_model: {
        input_tokens: number;
        output_tokens: number;
        total_tokens: number;
    };
}

interface GeocodingResponse {
    result: {
        search_result: CompanySearchResult[];
    }
    usage: UsageMetrics;
}

/**
 * 获取指定招聘公司的信息
 * @param company 企业名称
 * @returns 
 */
const getCompanyInfo = async (company: string) => {
    // ...
    const searchApiUrl = process.env.SEARCH_API_URL!;
    const geocodingUrl = searchApiUrl + ``;
    const geocodingResponse = await fetch(geocodingUrl);
    const geocodingData = (await geocodingResponse.json()) as GeocodingResponse;

    if (!geocodingData.result) {
        return new Error(`Company '${company}' not found!`)
    }

    const { result, usage } = geocodingData;
    const { title, link } = geocodingData.result.search_result[0];

    return { message: "xxx" }
}

const companyTool = createTool({
    id: "Get Company Information",
    description: `Fetch ... ?`,
    inputSchema: z.object({
        company: z.string().describe("Company name"),
    }),
    outputSchema: z.object({

    }),
    execute: async ({ context: { company } }) => {
        return await getCompanyInfo(company);
    }
})