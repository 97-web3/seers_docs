---
标题：实体
版本：0.1
最后更新：2025-12-14
所有者：产品与工程
状态：草稿
---

# 实体

## SportCategory
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| sportId | 字符串 | 必需，唯一 | 类别标识符（例如 `football`） |
| name | 字符串 | 必需 | 显示名称 |
| enabled | 布尔值 | 必需 | 是否可选 |
| activeMarketCount | 整数 | 可选 | 类别中的活跃市场数量 |

## League
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| leagueId | 字符串 | 必需，唯一 | 联赛标识符 |
| sportId | 字符串 | 必需 | 父级运动 |
| name | 字符串 | 必需 | 联赛名称 |
| enabled | 布尔值 | 必需 | 是否可选 |
| logoUrl | 字符串 | 可选 | 联赛标志 |

## Event
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| eventId | 字符串 | 必需，唯一 | 事件标识符 |
| leagueId | 字符串 | 必需 | 父级联赛 |
| sportId | 字符串 | 必需 | 父级运动 |
| eventType | 字符串 | 必需 | `HEAD_TO_HEAD`（对阵）或 `CHAMPION`（冠军） |
| name | 字符串 | 必需 | 事件名称 |
| startTime | 日期时间 | 必需 | 计划开始时间 |
| participants | 数组 | 可选 | 参与者（队伍/选手） |

## Participant
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| participantId | 字符串 | 必需 | 参与者标识符 |
| name | 字符串 | 必需 | 名称 |
| iconUrl | 字符串 | 可选 | 队徽/标志 |

## UserRef
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| userId | 字符串 | 可选 | 用户标识符（若可用） |
| displayName | 字符串 | 必需 | 用于 UI 展示的名称 |

## PredictionMarket
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| marketId | 字符串 | 必需，唯一 | 市场标识符 |
| eventId | 字符串 | 必需 | 来源事件 |
| sportId | 字符串 | 必需 | 运动类别 |
| leagueId | 字符串 | 必需 | 联赛 |
| mode | 字符串 | 必需 | 市场模式；本版本为 `BOOKMAKER` |
| createdBy | UserRef | 可选 | 创建者信息（展示名/用户标识符） |
| title | 字符串 | 必需 | 市场标题 |
| description | 字符串 | 可选 | 市场说明 |
| marketType | 字符串 | 必需 | 通常与 eventType 一致 |
| state | 字符串 | 必需 | `ACTIVE`（活跃）、`CLOSED`（关闭）、`SETTLED`（已结算）、`DISPUTED`（有争议）、`CANCELLED`（已取消） |
| participantCount | 整数 | 必需 | 市场中的参与者数量 |
| totalLiquidity | 货币 | 必需 | 总流动性（市场级别） |
| cutoffTime | 日期时间 | 必需 | 交易截止时间 |
| startTime | 日期时间 | 必需 | 事件开始时间 |
| settlementTime | 日期时间 | 可选 | 结算完成时间 |
| coverImageUrl | 字符串 | 可选 | 封面图片 |
| pinnedWeight | 整数 | 可选 | 排序权重 |
| hotnessScore | 十进制 | 可选 | 派生分数 |

## Adjudication
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| marketId | 字符串 | 必需 | 市场 |
| status | 字符串 | 必需 | 参见 `AdjudicationStatus` 枚举 |
| oracleProvider | 字符串 | 必需 | 预言机提供方（例如 UMA Protocol） |
| arbitrationProvider | 字符串 | 必需 | 仲裁提供方（例如 Kleros Court） |
| submittedAt | 日期时间 | 可选 | 候选结果提交时间 |
| challengeWindowEndsAt | 日期时间 | 可选 | 挑战期结束时间 |
| disputedAt | 日期时间 | 可选 | 争议被提出的时间 |
| decidedAt | 日期时间 | 可选 | 最终决定时间 |
| winningOptionIds | 数组 | 必需 | 结果选项 ID 列表（可为空） |
| notes | 字符串 | 可选 | 给用户的解释性说明 |

## Play
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| playId | 字符串 | 必需，唯一 | 投注项标识符 |
| marketId | 字符串 | 必需 | 父级市场 |
| playType | 字符串 | 必需 | `FUN`（娱乐）、`OVER_UNDER`（大小）、`SPREAD`（让分）、`CORRECT_SCORE`（正确比分）、`CHAMPION`（冠军） |
| period | 字符串 | 必需 | `FULL_MATCH`（全场）、`FIRST_HALF`（上半场）、`SECOND_HALF`（下半场） |
| config | 对象 | 可选 | 投注项类型特定的配置 |
| initialLiquidity | 货币 | 可选 | 创建时的初始流动性 |
| bookmakerEstimateOptionId | 字符串 | 可选 | 预先选择的估算选项 ID |

## MarketOption
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| optionId | 字符串 | 必需，唯一 | 选项标识符 |
| playId | 字符串 | 必需 | 父级投注项 |
| name | 字符串 | 必需 | 选项名称 |
| iconUrl | 字符串 | 可选 | 图标 |
| sharePct | 十进制 | 必需 | 0–100 |
| oddsDecimal | 十进制 | 可选，> 1 | 十进制赔率（用于潜在回报计算与展示）；如提供，交易报价应以此为准 |
| backedAmount | 货币 | 必需 | 支持该选项的金额 |
| locked | 布尔值 | 必需 | 如果为真，则不可操作 |
| bookmakerSide | 布尔值 | 可选 | 如果为真，表示该选项为创建者（庄家）锁定的持仓/立场；通常应同时视为不可下注 |
| bookmakerEstimate | 布尔值 | 必需 | 是否标记为估算 |

## MarketPriceSeries
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| marketId | 字符串 | 必需 | 市场 |
| optionId | 字符串 | 必需 | 选项 |
| points | 数组 | 必需 | 时间序列点 |

## PricePoint
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| ts | 日期时间 | 必需 | 时间戳 |
| sharePct | 十进制 | 必需 | 0–100 |

## WalletAccount / Balance
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| userId | 字符串 | 必需 | 用户 |
| availableBalance | 货币 | 必需 | 当前可用余额 |

## BetOrder
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| betId | 字符串 | 必需，唯一 | 投注单标识符 |
| userId | 字符串 | 必需 | 用户 |
| marketId | 字符串 | 必需 | 市场 |
| optionId | 字符串 | 必需 | 选项 |
| stake | 货币 | 必需 | 投注金额 |
| fee | 货币 | 必需 | 费用 |
| status | 字符串 | 必需 | `ACCEPTED`（已接受）或 `REJECTED`（已拒绝） |
| createdAt | 日期时间 | 必需 | 创建时间 |

## Position
| 属性 | 类型 | 约束 | 描述 |
|---|---|---|---|
| positionId | 字符串 | 必需，唯一 | 持仓标识符 |
| userId | 字符串 | 必需 | 用户 |
| marketId | 字符串 | 必需 | 市场 |
| optionId | 字符串 | 必需 | 选项 |
| status | 字符串 | 必需 | `OPEN`（持仓中）或 `SETTLED`（已结算） |
| stake | 货币 | 必需 | 此持仓的总投注额 |
| potentialProfit | 货币 | 可选 | 潜在利润（结算前） |
| payout | 货币 | 可选 | 最终支付金额（结算后） |
