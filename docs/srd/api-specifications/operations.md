---
标题：运营配置 API
版本：0.1
最后更新：2025-12-14
所有者：产品与工程部
状态：草稿
---

# 运营配置 API

## 1. 概述
提供影响产品功能排序、特性布局和可用性的运营配置值。

## 2. 接口
### 2.1 精选市场
`GET /api/config/featured-markets`

**响应 (200)**
```json
{
  "version": "cfg_2025-12-14_001",
  "items": [
    { "marketId": "mkt_001", "rank": 1 },
    { "marketId": "mkt_002", "rank": 2 }
  ]
}
```

### 2.2 置顶权重
`GET /api/config/pinned-weights`

**响应 (200)**
```json
{
  "version": "cfg_2025-12-14_001",
  "items": [
    { "marketId": "mkt_001", "pinnedWeight": 100 }
  ]
}
```

### 2.3 费用率
`GET /api/config/fee-rate`

**响应 (200)**
```json
{ "feeRate": 0.002, "effectiveAt": "2025-12-14T00:00:00Z" }
```

## 3. 备注
- 配置响应应包含版本标识符，以支持调试和一致性。