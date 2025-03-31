import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RestStockClient } from "@fugle/marketdata/lib/rest/stock/client";
import { z } from "zod";
import quoteReference from "./references/quote.json";

/**
 * 註冊股票報價相關的工具到 MCP Server
 * @param {Object} server MCP Server 實例
 * @param {Object} stock 股票 API 客戶端
 */
export function registerQuoteTools(server: McpServer, stock: RestStockClient) {
  // 取得即時報價工具
  server.tool(
    "get_stock_intraday_quote",
    "取得股票即時報價",
    {
      symbol: z.string().describe("股票代碼，例如：2330"),
      type: z.string().optional().describe("類型，可選 oddlot 盤中零股"),
    },
    async ({ symbol, type }) => {
      try {
        // 透過API獲取股票資訊
        const data = await stock.intraday.quote({
          symbol,
          type: type === "oddlot" ? "oddlot" : undefined,
        });

        const response = `API Response\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\nField Description\n\`\`\`json\n${JSON.stringify(quoteReference, null, 2)}\n\`\`\``;

        return {
          content: [{ type: "text", text: response }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `查詢股票 ${symbol} 資訊時發生錯誤: ${error || "未知錯誤"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
