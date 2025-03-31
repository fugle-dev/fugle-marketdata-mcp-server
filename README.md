# Fugle MCP Server

富果行情 MCP (Model Context Protocol) 服務器，用於與富果交易系統進行互動。此服務器支持股票行情查詢。

## 功能特點

- 支持股票即時行情查詢
- 支持歷史數據查詢

## 使用方法

### 環境變量

服務器需要以下環境變量：

- `API_KEY`: 富果行情 API Key

### NPM 配置

在你的 `mcp config` 中添加：

```json
{
  "mcpServers": {
    "@fugle/marketdata-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "https://github.com/fugle-dev/fugle-marketdata-mcp-server/releases/download/v0.0.1/fugle-marketdata-mcp-server-0.0.1.tgz"
      ],
      "env": {
        "API_KEY": "<API_KEY>"
      }
    }
  }
}
```
