# Fugle MCP Server

富果行情 MCP (Model Context Protocol) 服務器，用於與富果交易系統進行互動。此服務器支持股票行情查詢。

## 功能特點

- 📊 支持股票即時行情查詢
- 📈 支持歷史數據查詢
- 📚 使用 Fugle Developer MarketData SDK documentation

## 事前準備

- [NodeJs](https://nodejs.org/zh-tw)
- [Fugle MarketData API Key](https://developer.fugle.tw/docs/key)
- Claude Desktop or 其他 MCP Client

## 使用方法

### 環境變量

服務器需要以下環境變量：

- `API_KEY`: 富果行情 API Key

###  配置 Claude Desktop 

在你的 `mcp config` 中添加：

1. 開啟 Claude Desktop
2. 點選 Settings
3. 選取 "Developer" 與按下 "Edit Config"
4. 將以下設定複製到 claude_desktop_config.json 檔案內

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

### 範例 Promopt

- 幫我抓取 2330 最新股價
- 顯示 2330 最近 10 天的股價資訊
- 更多的實用案例等你來一起發掘

### 了解更多

更多功能，可透過使用 [元富 / 富邦 MCP](https://github.com/fugle-dev/fugle-mcp-server/tree/main) 做部位管理、下單...... 等  
