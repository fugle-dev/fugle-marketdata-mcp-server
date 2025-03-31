import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RestStockClient } from "@fugle/marketdata/lib/rest/stock/client";
import { z } from "zod";
import statsReference from "./references/stats.json";

/**
 * 註冊股票近 52 週股價數據查詢工具到 MCP Server
 * @param {McpServer} server MCP Server 實例
 * @param {RestStockClient} stock 股票 API 客戶端
 */
export function registerHistoricalStatsTools(server: McpServer, stock: RestStockClient) {
  // 取得股票近 52 週股價數據工具
  server.tool(
    "get_stock_historical_stats",
    "取得近 52 週股價數據（依代碼查詢）",
    {
      symbol: z.string().describe("股票代碼，例如：2330"),
    },
    async ({ symbol }) => {
      try {
        // 透過API獲取股票近 52 週股價數據
        const data = await stock.historical.stats({
          symbol,
        });

        const response = `API Response\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\nField Description\n\`\`\`json\n${JSON.stringify(statsReference, null, 2)}\n\`\`\``;

        return {
          content: [{ type: "text", text: response }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `查詢股票 ${symbol} 近 52 週股價數據時發生錯誤: ${error || "未知錯誤"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
