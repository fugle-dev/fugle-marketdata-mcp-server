import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RestStockClient } from "@fugle/marketdata/lib/rest/stock/client";
import { z } from "zod";
import tradesReference from "./references/trades.json";

/**
 * 註冊股票成交明細查詢工具到 MCP Server
 * @param {McpServer} server MCP Server 實例
 * @param {RestStockClient} stock 股票 API 客戶端
 */
export function registerTradesTools(server: McpServer, stock: RestStockClient) {
  // 取得股票成交明細工具
  server.tool(
    "get_stock_intraday_trades",
    "取得股票成交明細（依代碼查詢）",
    {
      symbol: z.string().describe("股票代碼，例如：2330"),
      type: z
        .literal("oddlot")
        .optional()
        .describe("Ticker 類型，可選 oddlot 盤中零股"),
      limit: z
        .number()
        .int()
        .positive()
        .max(100)
        .optional()
        .describe("限制回傳筆數，預設 50 筆，最多 100 筆"),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("偏移量，用於分頁查詢"),
    },
    async ({ symbol, type, limit = 50, offset }) => {
      try {
        // 透過API獲取股票成交明細
        const data = await stock.intraday.trades({
          symbol,
          type: type === "oddlot" ? "oddlot" : undefined,
          limit,
          offset,
        });

        const response = `API Response\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\nField Description\n\`\`\`json\n${JSON.stringify(tradesReference, null, 2)}\n\`\`\``;

        return {
          content: [{ type: "text", text: response }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `查詢股票 ${symbol} 成交明細時發生錯誤: ${error || "未知錯誤"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
