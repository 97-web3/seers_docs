---
标题：投资组合 API
版本：0.1
最后更新：2025-12-14
所有者：产品与工程部
状态：草稿
---

# 投资组合 API

## 1. 概述
为给定市场提供用户持仓和摘要。

## 2. 接口

### 2.1 获取市场投资组合摘要
`GET /api/portfolio/markets/{marketId}/summary`

**响应 (200)**
```json
{
  "marketId": "mkt_001",
  "totalStake": { "amount": 50.0, "currency": "USD" },
  "maxPotentialProfit": { "amount": 55.0, "currency": "USD" },
  "hasHedgedExposure": false
}
```

### 2.2 列出市场中的持仓
`GET /api/portfolio/markets/{marketId}/positions`

**响应 (200)**
```json
{
  "items": [
    {
      "positionId": "pos_001",
      "marketId": "mkt_001",
      "optionId": "opt_a",
      "status": "OPEN",
      "stake": { "amount": 50.0, "currency": "USD" },
      "potentialProfit": { "amount": 55.0, "currency": "USD" }
    }
  ]
}
```