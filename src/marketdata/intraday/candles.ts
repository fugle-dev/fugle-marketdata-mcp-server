import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RestStockClient } from "@fugle/marketdata/lib/rest/stock/client";
import { z } from "zod";
import candlesReference from "./references/candles.json";

/**
 * 註冊股票K線資料相關的工具到 MCP Server
 * @param {McpServer} server MCP Server 實例
 * @param {RestStockClient} stock 股票 API 客戶端
 */
export function registerCandlesTools(server: McpServer, stock: RestStockClient) {
  server.tool(
    "get_stock_intraday_candles",
    "取得當日股票K線資料",
    {
      symbol: z.string().describe("股票代碼，例如：2330"),
    },
    async ({ symbol }) => {
      try {
        // 透過API獲取K線數據
        const data = await stock.intraday.candles({ symbol });

        const response = `API Response\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\nField Description\n\`\`\`json\n${JSON.stringify(candlesReference, null, 2)}\n\`\`\``;

        return {
          content: [{ type: "text", text: response }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `查詢股票 ${symbol} K線資料時發生錯誤: ${error || "未知錯誤"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
