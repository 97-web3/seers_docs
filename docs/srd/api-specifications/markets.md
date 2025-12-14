---
标题：Markets API
版本：0.1
最后更新：2025-12-14
所有者：产品与工程
状态：草稿
---

# 市场 API

## 1. 概述
支持发现列表、市场详情、期权细分、趋势序列、规则、裁决和结算可见性。

## 2. 终端节点

### 2.1 列出市场（发现）
`GET /api/markets?status=active&sportId={sportId?}&sort=priority&page={page?}&pageSize={pageSize?}`

**查询参数**
| 名称 | 必需 | 类型 | 备注 |
|---|---:|---|---|
| status | 是 | 字符串 | `active` 为发现默认值 |
| sportId | 否 | 字符串 | 按体育类别过滤 |
| sort | 否 | 字符串 | `priority` 应用置顶/热门/最新规则 |
| page | 否 | 整数 | 默认为 1 |
| pageSize | 否 | 整数 | 待定 |

**响应 (200)**
```json
{
  "items": [
    {
      "marketId": "mkt_001",
      "sportId": "football",
      "leagueId": "epl",
      "eventId": "evt_123",
      "marketType": "HEAD_TO_HEAD",
      "title": "德比：A队 vs B队",
      "startTime": "2025-12-20T12:00:00Z",
      "state": "ACTIVE",
      "participantCount": 1400,
      "totalLiquidity": { "amount": 5200000, "currency": "USD" },
      "pinnedWeight": 10,
      "hotnessScore": 0.0,
      "coverImageUrl": "https://...",
      "optionPreview": [
        { "optionId": "opt_a", "name": "A队", "backedAmount": { "amount": 2500000, "currency": "USD" }, "sharePct": 48.0 },
        { "optionId": "opt_draw", "name": "平局", "backedAmount": { "amount": 900000, "currency": "USD" }, "sharePct": 17.0 },
        { "optionId": "opt_b", "name": "B队", "backedAmount": { "amount": 1800000, "currency": "USD" }, "sharePct": 35.0 }
      ],
      "optionCount": 3
    }
  ],
  "page": 1,
  "pageSize": 20,
  "total": 200
}
```

### 2.2 列出精选市场
`GET /api/markets/featured?limit=3`

**响应 (200)**：与列出市场具有相同的项目形状（允许子集）。

### 2.3 获取市场详情
`GET /api/markets/{marketId}`

**响应 (200)**
```json
{
  "marketId": "mkt_001",
  "title": "德比：A队 vs B队",
  "description": "预测最终结果。价格反映了人群的隐含概率。市场将于 2025/12/20 12:00 结算。",
  "state": "ACTIVE",
  "sportId": "football",
  "leagueId": "epl",
  "eventId": "evt_123",
  "startTime": "2025-12-20T12:00:00Z",
  "cutoffTime": "2025-12-20T11:45:00Z",
  "settlementTime": null,
  "participantCount": 1400,
  "totalLiquidity": { "amount": 5200000, "currency": "USD" },
  "coverImageUrl": "https://..."
}
```

### 2.4 列出市场期权
`GET /api/markets/{marketId}/options`

**响应 (200)**
```json
{
  "items": [
    {
      "optionId": "opt_a",
      "name": "A队",
      "iconUrl": "https://...",
      "sharePct": 48.0,
      "backedAmount": { "amount": 2500000, "currency": "USD" },
      "locked": false,
      "bookmakerEstimate": false,
      "recentParticipantAvatars": ["https://..."],
      "participantCount": 208
    }
  ]
}
```

### 2.5 获取市场价格历史（趋势）
`GET /api/markets/{marketId}/price-history?range={1h|1d|1w|1m|all}`

**响应 (200)**
```json
{
  "range": "all",
  "series": [
    {
      "optionId": "opt_a",
      "points": [
        { "ts": "2025-12-01T00:00:00Z", "sharePct": 40.0 },
        { "ts": "2025-12-14T00:00:00Z", "sharePct": 48.0 }
      ]
    }
  ]
}
```

### 2.6 获取市场规则
`GET /api/markets/{marketId}/rules`

**响应 (200)**
```json
{
  "items": [
    { "ruleId": "r1", "title": "结算工作原理", "content": "..." }
  ]
}
```

### 2.7 获取裁决
`GET /api/markets/{marketId}/adjudication`

**响应 (200)**
```json
{
  "status": "PENDING",
  "decidedAt": null,
  "winningOptionIds": [],
  "notes": null
}
```

### 2.8 获取结算
`GET /api/markets/{marketId}/settlement`

**响应 (200)**
```json
{
  "status": "NOT_SETTLED",
  "settledAt": null,
  "payoutCurrency": "USD"
}
```

## 3. 备注/限制
- `state` 必须是权威性的，并用于限制交易操作。
- `locked=true` 的期权不得可操作。