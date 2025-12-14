---
title: 枚举
version: 0.1
last-updated: 2025-12-14
owner: 产品与工程
status: 草稿
---

# 枚举

## 市场状态 (MarketState)
| 值 | 含义 |
|---|---|
| ACTIVE | 可交易；截止前允许下注 |
| CLOSED | 截止时间已过；只读；等待结算 |
| SETTLED | 已最终确定；结果和支付可用 |

## 事件类型 (EventType)
| 值 | 含义 |
|---|---|
| HEAD_TO_HEAD | 两个主要参与者（主队/客队） |
| CHAMPION | 多个参与者；“谁是冠军”式的 |

## 周期 (Period)
| 值 | 含义 |
|---|---|
| FULL_MATCH | 全场比赛时间 |
| FIRST_HALF | 上半场 |
| SECOND_HALF | 下半场 |

## 玩法类型 (PlayType)
| 值 | 含义 |
|---|---|
| FUN | 由配置驱动的趣味玩法 |
| OVER_UNDER | 大/小基准 |
| SPREAD | 让分/盘口 |
| CORRECT_SCORE | 精确比分结果 |
| CHAMPION | 冠军获胜预测（专业趣味玩法） |

## 裁决状态 (AdjudicationStatus)
| 值 | 含义 |
|---|---|
| PENDING | 尚未做出决定 |
| DECIDED | 已宣布获胜选项 |
| DISPUTED | 存在争议（可选的未来状态） |

## 下注状态 (BetStatus)
| 值 | 含义 |
|---|---|
| ACCEPTED | 已记录和处理的下注 |
| REJECTED | 已拒绝的下注，并附带原因 |

## 持仓状态 (PositionStatus)
| 值 | 含义 |
|---|---|
| OPEN | 持有仓位；市场尚未结算 |
| SETTLED | 结算后已解决的仓位 |