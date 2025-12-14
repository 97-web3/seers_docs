---
title: 市场创建 API
version: 0.1
last-updated: 2025-12-14
owner: 产品与工程
status: 草稿
---

# 市场创建 API

## 1. 概述
支持创建庄家模式的市场，包括玩法配置和封面选择。

## 2. 接口

### 2.1 列出玩法配置
`GET /api/config/play-types?sportId={sportId}`

### 2.2 列出趣味玩法配置
`GET /api/config/fun-plays?sportId={sportId}`

### 2.3 列出封面预设
`GET /api/media/presets?type=market-cover`

### 2.4 上传封面图片
`POST /api/media/uploads`

**请求**: multipart 上传或预签名上传协商（实现决定）。响应必须返回稳定的 `mediaId` 和 `url`。

**响应 (201)**
```json
{ "mediaId": "med_001", "url": "https://..." }
```

### 2.5 创建市场
`POST /api/markets`

**请求头**
- `Authorization: Bearer <token>`
- `Idempotency-Key: <unique>`

**请求体 (示例)**
```json
{
  "sportId": "football",
  "leagueId": "epl",
  "eventId": "evt_123",
  "cover": { "type": "PRESET", "mediaId": "preset_01" },
  "cutoffTime": "2025-12-20T11:45:00Z",
  "mode": "BOOKMAKER",
  "plays": [
    {
      "period": "FULL_MATCH",
      "playType": "OVER_UNDER",
      "config": { "baseline": 1.5 },
      "initialLiquidity": { "amount": 1000.0, "currency": "USD" },
      "bookmakerEstimateOptionId": "over"
    }
  ]
}
```

**响应 (201)**
```json
{ "marketId": "mkt_999", "createdAt": "2025-12-14T13:21:00Z" }
```

## 3. 验证规则
- 缺少必填字段必须返回 `VALIDATION_FAILED`。
- 余额不足必须返回 `INSUFFICIENT_BALANCE`。