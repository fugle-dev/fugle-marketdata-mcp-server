import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { RestStockClient } from "@fugle/marketdata/lib/rest/stock/client";
import { z } from "zod";
import activesReference from "./references/actives.json";

/**
 * 註冊股票成交量值排行查詢工具到 MCP Server
 * @param {McpServer} server MCP Server 實例
 * @param {RestStockClient} stock 股票 API 客戶端
 */
export function registerActivesTools(server: McpServer, stock: RestStockClient) {
  // 取得股票成交量值排行工具
  server.tool(
    "get_stock_snapshot_actives",
    "取得股票成交量值排行（依市場別）",
    {
      market: z
        .enum(["TSE", "OTC", "ESB", "TIB", "PSB"])
        .describe(
          "市場別，可選 TSE 上市；OTC 上櫃；ESB 興櫃一般板；TIB 臺灣創新板；PSB 興櫃戰略新板"
        ),
      trade: z
        .enum(["volume", "value"])
        .describe("成交量／成交值，可選 volume 成交量；value 成交值"),
      type: z
        .enum(["COMMONSTOCK", "ALL", "ALLBUT0999"])
        .optional()
        .describe(
          "標的類型，可選 ALLBUT0999 包含一般股票、特別股及ETF；COMMONSTOCK 為一般股票；ALL 為全部"
        ),
      limit: z
        .number()
        .int()
        .positive()
        .max(50)
        .optional()
        .describe("限制回傳筆數，最多 50 筆"),
    },
    async ({ market, trade, type, limit = 20 }) => {
      try {
        // 透過API獲取股票成交量值排行
        const data = await stock.snapshot.actives({
          market,
          trade,
          type,
        });

        const response = `API Response\n\`\`\`json\n${JSON.stringify(data, null, 2)}\n\`\`\`\n\nField Description\n\`\`\`json\n${JSON.stringify(activesReference, null, 2)}\n\`\`\``;

        return {
          content: [{ type: "text", text: response }],
        };
      } catch (error) {
        return {
          content: [
            {
              type: "text",
              text: `查詢股票成交量值排行時發生錯誤: ${error || "未知錯誤"}`,
            },
          ],
          isError: true,
        };
      }
    }
  );
}
