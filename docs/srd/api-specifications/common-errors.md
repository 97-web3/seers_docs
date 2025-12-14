---
标题：常见错误和消息传递
版本：0.1
最后更新：2025-12-14
所有者：产品与工程
状态：草稿
---

# 常见错误和消息传递

## 1. 标准错误信封
所有错误响应必须使用一致的结构：

```json
{
  "error": {
    "code": "STRING_CODE",
    "message": "适合用户界面显示的易于理解的消息",
    "details": {
      "fieldErrors": [
        { "field": "stake", "reason": "MIN_VALUE", "message": "最小投注额为 1" }
      ]
    },
    "requestId": "不透明的请求ID"
  }
}
```

## 2. 常见错误代码
| 代码 | 含义 | 典型 HTTP 状态码 |
|---|---|---:|
| UNAUTHENTICATED | 缺少/无效的凭证 | 401 |
| UNAUTHORIZED | 已认证但未授权 | 403 |
| NOT_FOUND | 资源不存在 | 404 |
| VALIDATION_FAILED | 输入验证失败 | 400 |
| INSUFFICIENT_BALANCE | 钱包余额不足 | 409 |
| MARKET_CLOSED | 市场未处于可交易状态 | 409 |
| OPTION_LOCKED | 选项无法下注 | 409 |
| LIMIT_EXCEEDED | 违反投注/流动性限制 | 409 |
| RATE_LIMITED | 请求过多 | 429 |
| INTERNAL_ERROR | 未处理的服务器错误 | 500 |
| UPSTREAM_UNAVAILABLE | 依赖项不可用 | 503 |

## 3. 验证错误详情
返回 `VALIDATION_FAILED` 时，应填充 `details.fieldErrors` 以启用字段级别的用户界面消息传递。

## 4. 用户消息要求
- `message` 对最终用户必须是安全的（不得包含内部堆栈跟踪）。
- 对于可重试的错误，客户端应能通过 `code`（或如果添加了明确的布尔字段）推断出是否可重试。