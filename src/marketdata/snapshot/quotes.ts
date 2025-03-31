import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RestStockClient } from "@fugle/marketdata/lib/rest/stock/client";
import { z } from "zod";
import quotesReference from "./references/quotes.json";

/**
 * 註冊股票行情快照查詢工具到 MCP Server
 * @param {McpServer} server MCP Server 實例
 * @param {RestStockClient} stock 股票 API 客戶端
 */
export function registerQuotesTools(server: McpServer, stock: RestStockClient) {
  // 取得股票行情快照工具
  server.tool(
    "get_stock_snapshot_quotes",
    "取得股票行情快照（依市場別）",
    {
      market: z
        .enum(["TSE", "OTC", "ESB", "TIB", "PSB"])
        .describe("市場別，可選 TSE 上市；OTC 上櫃；ESB 興櫃一般板；TIB 臺灣創新板；PSB 興櫃戰略新板"),
      type: z
        .enum(["COMMONSTOCK", "ALL", "ALLBUT0999"])
        .optional()
        .describe("標的類型，可選 ALLBUT0999 包含一般股票、特別股及ETF；COMMONSTOCK 為一般股票；ALL 為全部"),
      limit: z
        .number()
        .int()
        .positive()
        .max(100)
        .optional()
        .describe("限制回傳筆數，最多 100 筆"),
      offset: z
        .number()
        .int()
        .min(0)
        .optional()
        .describe("偏移量，用於分頁查詢"),
      search: z
        .string()
        .optional()
        .describe("搜尋代碼或名稱"),
    },
    async ({ market, type, limit = 50, offset = 0, search }) => {
      try {
        // 透過API獲取股票行情快照
        const data = await stock.snapshot.quotes({
          market,
          type,
        });

        const response = `API Response\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\nField Description\n\`\`\`json\n${JSON.stringify(quotesReference, null, 2)}\n\`\`\``;

        return {
          content: [{ type: "text", text: response }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `查詢股票行情快照時發生錯誤: ${error || "未知錯誤"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}