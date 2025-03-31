import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RestStockClient } from "@fugle/marketdata/lib/rest/stock/client";
import { z } from "zod";
import tickerReference from "./references/ticker.json";
import securityTypeReference from "./references/security-type.json";

/**
 * 註冊股票資訊相關的工具到 MCP Server
 * @param {McpServer} server MCP Server 實例
 * @param {RestStockClient} stock 股票 API 客戶端
 */
export function registerTickerTools(server: McpServer, stock: RestStockClient) {
  // 獲取股票詳細資訊工具
  server.tool(
    "get_stock_intraday_ticker",
    "取得股票詳細資訊",
    {
      symbol: z.string().describe("股票代碼，例如：2330"),
      type: z.literal("oddlot").optional().describe("類型，盤中零股"),
    },
    async ({ symbol, type }) => {
      try {
        // 透過API獲取股票基本資訊
        const data = await stock.intraday.ticker({
          symbol,
          type: type === "oddlot" ? "oddlot" : undefined,
        });

        const response = `API Response\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\nField Description\n\`\`\`json\n${JSON.stringify(tickerReference, null, 2)}\n\`\`\`\n\nSecurity Type Codes\n\`\`\`json\n${JSON.stringify(securityTypeReference, null, 2)}\n\`\`\``;

        return {
          content: [{ type: "text", text: response }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `查詢股票 ${symbol} 詳細資訊時發生錯誤: ${error || "未知錯誤"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
