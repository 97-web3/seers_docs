---
title: 交易API
version: 0.1
last-updated: 2025-12-14
owner: 产品与工程部
status: 草稿
---

# 交易API

## 1. 概述
支持对市场选项进行报价和下注，并提供幂等性和清晰的验证失败信息。

## 2. 接口

### 2.1 报价
`POST /api/trading/quote`

**请求头**
- `Authorization: Bearer <token>`

**请求体**
```json
{
  "marketId": "mkt_001",
  "optionId": "opt_a",
  "stake": { "amount": 50.0, "currency": "USD" }
}
```

**响应 (200)**
```json
{
  "marketId": "mkt_001",
  "optionId": "opt_a",
  "stake": { "amount": 50.0, "currency": "USD" },
  "impliedProbability": 0.48,
  "potentialReturn": { "amount": 104.17, "currency": "USD" },
  "feeRate": 0.002,
  "fee": { "amount": 0.10, "currency": "USD" },
  "netProfit": { "amount": 54.07, "currency": "USD" },
  "constraints": {
    "minStake": { "amount": 1.0, "currency": "USD" },
    "maxStakeByBalance": { "amount": 1200.0, "currency": "USD" },
    "maxStakeByLiquidity": { "amount": 520000.0, "currency": "USD" }
  }
}
```

### 2.2 下注
`POST /api/trading/bets`

**请求头**
- `Authorization: Bearer <token>`
- `Idempotency-Key: <unique>`

**请求体**
```json
{
  "marketId": "mkt_001",
  "optionId": "opt_a",
  "stake": { "amount": 50.0, "currency": "USD" }
}
```

**响应 (201)**
```json
{
  "betId": "bet_123",
  "status": "ACCEPTED",
  "createdAt": "2025-12-14T13:21:00Z"
}
```

### 2.3 获取下注状态
`GET /api/trading/bets/{betId}`

**响应 (200)**
```json
{
  "betId": "bet_123",
  "status": "ACCEPTED",
  "marketId": "mkt_001",
  "optionId": "opt_a",
  "stake": { "amount": 50.0, "currency": "USD" },
  "fee": { "amount": 0.10, "currency": "USD" },
  "createdAt": "2025-12-14T13:21:00Z"
}
```

## 3. 错误处理
- 验证和约束失败必须返回 `VALIDATION_FAILED` 或特定的代码，例如 `LIMIT_EXCEEDED`（超出限制）、`MARKET_CLOSED`（市场已关闭）、`INSUFFICIENT_BALANCE`（余额不足）。
- 使用 `api-specifications/common-errors.md` 中的标准错误信封。