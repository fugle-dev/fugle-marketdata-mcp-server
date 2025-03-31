#!/usr/bin/env node

import fs from "fs";
import { RestClient, WebSocketClient } from "@fugle/marketdata";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  registerCandlesTools,
  registerQuoteTools,
  registerTickersTools,
  registerTickerTools,
  registerTradesTools,
  registerVolumesTools,
} from "./marketdata/intraday";
import {
  registerActivesTools,
  registerMoversTools,
  registerQuotesTools,
} from "./marketdata/snapshot";
import {
  registerHistoricalCandlesTools,
  registerHistoricalStatsTools,
} from "./marketdata/historical";

import { version } from "../package.json";
import { RestStockClient } from "@fugle/marketdata/lib/rest/stock/client";
import { RestFutOptClient } from "@fugle/marketdata/lib/rest/futopt/client";

// 檢查環境變量
const { API_KEY } = process.env;

if (!API_KEY) {
  console.error("Error: API_KEY is not set in the environment variables.");
  process.exit(1); // Exit with error code
}

class FugleMcpServer {
  private server: McpServer;
  private sdk: RestClient;
  private stock: RestStockClient;
  private futopt: RestFutOptClient;

  constructor() {
    this.server = new McpServer({
      name: "fugle-marketdata-mcp-server",
      version: version,
    });

    this.sdk = new RestClient({ apiKey: API_KEY });

    this.stock = this.sdk.stock;
    this.futopt = this.sdk.futopt;

    this.registerMarketdataTools();
  }

  registerMarketdataTools() {
    this.registerIntradayTools();
    this.registerSnapshotTools();
    this.registerHistoricalTools();
  }

  registerHistoricalTools() {
    registerHistoricalCandlesTools(this.server, this.stock);
    registerHistoricalStatsTools(this.server, this.stock);
  }

  registerIntradayTools() {
    registerTickerTools(this.server, this.stock);
    registerQuoteTools(this.server, this.stock);
    registerCandlesTools(this.server, this.stock);
    registerTickersTools(this.server, this.stock);
    registerTradesTools(this.server, this.stock);
    registerVolumesTools(this.server, this.stock);
  }

  registerSnapshotTools() {
    registerMoversTools(this.server, this.stock);
    registerActivesTools(this.server, this.stock);
    registerQuotesTools(this.server, this.stock);
  }

  async runServer() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
  }
}

function main() {
  const fugleMcpServer = new FugleMcpServer();
  fugleMcpServer.runServer().catch((error) => {
    console.error("Fatal error in main():", error);
    process.exit(1);
  });
}

main();
