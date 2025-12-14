---
title: 事件 API
version: 0.1
last-updated: 2025-12-14
owner: 产品与工程部
status: 草稿
---

# 事件 API

## 1. 概述
提供体育分类和事件元数据，用于发现和盘口创建流程。

## 2. 端点

### 2.1 列出体育类别
`GET /api/sports`

**响应 (200)**
```json
{
  "items": [
    { "sportId": "football", "name": "足球", "enabled": true, "activeMarketCount": 11 }
  ]
}
```

### 2.2 列出某项运动的联赛
`GET /api/leagues?sportId={sportId}`

**查询参数**
| 名称 | 必需 | 类型 | 备注 |
|---|---:|---|---|
| sportId | 是 | string | 体育类别标识符 |

**响应 (200)**
```json
{
  "items": [
    { "leagueId": "epl", "sportId": "football", "name": "英超联赛", "enabled": true }
  ]
}
```

### 2.3 列出某联赛的事件
`GET /api/events?leagueId={leagueId}`

**响应 (200)**
```json
{
  "items": [
    {
      "eventId": "evt_123",
      "leagueId": "epl",
      "sportId": "football",
      "eventType": "HEAD_TO_HEAD",
      "name": "A队 对阵 B队",
      "startTime": "2025-12-20T12:00:00Z",
      "participants": [
        { "participantId": "team_a", "name": "A队", "iconUrl": "https://..." },
        { "participantId": "team_b", "name": "B队", "iconUrl": "https://..." }
      ]
    },
    {
      "eventId": "evt_champion_1",
      "leagueId": "epl",
      "sportId": "football",
      "eventType": "CHAMPION",
      "name": "谁是冠军",
      "startTime": "2026-05-20T12:00:00Z",
      "participants": []
    }
  ]
}
```

## 3. 备注/限制
- 事件开始时间必须是权威性的，并用于验证创建流程中的盘口截止时间。
- 如果返回 `enabled=false` 的体育项目或联赛，客户端不得允许选择。