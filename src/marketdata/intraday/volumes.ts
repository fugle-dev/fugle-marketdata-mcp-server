import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RestStockClient } from "@fugle/marketdata/lib/rest/stock/client";
import { z } from "zod";
import volumesReference from "./references/volumes.json";

/**
 * 註冊股票分價量表查詢工具到 MCP Server
 * @param {McpServer} server MCP Server 實例
 * @param {RestStockClient} stock 股票 API 客戶端
 */
export function registerVolumesTools(server: McpServer, stock: RestStockClient) {
  // 取得股票分價量表工具
  server.tool(
    "get_stock_intraday_volumes",
    "取得股票分價量表（依代碼查詢）",
    {
      symbol: z.string().describe("股票代碼，例如：2330"),
      type: z
        .literal("oddlot")
        .optional()
        .describe("Ticker 類型，可選 oddlot 盤中零股"),
    },
    async ({ symbol, type }) => {
      try {
        // 透過API獲取股票分價量表
        const data = await stock.intraday.volumes({
          symbol,
          type: type === "oddlot" ? "oddlot" : undefined,
        });

        const response = `API Response\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\nField Description\n\`\`\`json\n${JSON.stringify(volumesReference, null, 2)}\n\`\`\``;

        return {
          content: [{ type: "text", text: response }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `查詢股票 ${symbol} 分價量表時發生錯誤: ${error || "未知錯誤"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
