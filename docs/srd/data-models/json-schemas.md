---
title: JSON 模式
version: 0.1
last-updated: 2025-12-14
owner: 产品与工程
status: 草稿
---

# JSON 模式

## 1. 备注
- 此处的模式是中性的 JSON Schema (draft-07 风格)。实现可以酌情使用更新的草案。
- 为提高可读性，可重用片段内联显示；生产合约可能会将 `$ref` 外部化。

## 2. 货币
```json
{
  "$id": "Money",
  "type": "object",
  "required": ["amount", "currency"],
  "properties": {
    "amount": { "type": "number" },
    "currency": { "type": "string", "minLength": 3, "maxLength": 3 }
  }
}
```

## 3. 市场摘要
```json
{
  "$id": "MarketSummary",
  "type": "object",
  "required": ["marketId", "title", "state", "sportId", "leagueId", "eventId", "startTime", "participantCount", "totalLiquidity", "optionCount"],
  "properties": {
    "marketId": { "type": "string" },
    "title": { "type": "string" },
    "state": { "type": "string", "enum": ["ACTIVE", "CLOSED", "SETTLED"] },
    "sportId": { "type": "string" },
    "leagueId": { "type": "string" },
    "eventId": { "type": "string" },
    "startTime": { "type": "string", "format": "date-time" },
    "participantCount": { "type": "integer", "minimum": 0 },
    "totalLiquidity": { "$ref": "Money" },
    "coverImageUrl": { "type": "string" },
    "pinnedWeight": { "type": "integer" },
    "hotnessScore": { "type": "number" },
    "optionCount": { "type": "integer", "minimum": 2 }
  }
}
```

## 4. 交易报价请求
```json
{
  "$id": "TradeQuoteRequest",
  "type": "object",
  "required": ["marketId", "optionId", "stake"],
  "properties": {
    "marketId": { "type": "string" },
    "optionId": { "type": "string" },
    "stake": { "$ref": "Money" }
  }
}
```

## 5. 投注创建请求
```json
{
  "$id": "BetCreateRequest",
  "type": "object",
  "required": ["marketId", "optionId", "stake"],
  "properties": {
    "marketId": { "type": "string" },
    "optionId": { "type": "string" },
    "stake": { "$ref": "Money" }
  }
}
```

## 6. 市场创建请求
```json
{
  "$id": "MarketCreateRequest",
  "type": "object",
  "required": ["sportId", "leagueId", "eventId", "mode", "cutoffTime", "plays"],
  "properties": {
    "sportId": { "type": "string" },
    "leagueId": { "type": "string" },
    "eventId": { "type": "string" },
    "mode": { "type": "string", "enum": ["BOOKMAKER"] },
    "cutoffTime": { "type": "string", "format": "date-time" },
    "cover": {
      "type": "object",
      "required": ["type"],
      "properties": {
        "type": { "type": "string", "enum": ["PRESET", "UPLOAD"] },
        "mediaId": { "type": "string" },
        "url": { "type": "string" }
      }
    },
    "plays": {
      "type": "array",
      "minItems": 1,
      "items": {
        "type": "object",
        "required": ["period", "playType", "initialLiquidity"],
        "properties": {
          "period": { "type": "string", "enum": ["FULL_MATCH", "FIRST_HALF", "SECOND_HALF"] },
          "playType": { "type": "string", "enum": ["FUN", "OVER_UNDER", "SPREAD", "CORRECT_SCORE", "CHAMPION"] },
          "config": { "type": "object" },
          "initialLiquidity": { "$ref": "Money" },
          "bookmakerEstimateOptionId": { "type": "string" }
        }
      }
    }
  }
}
```