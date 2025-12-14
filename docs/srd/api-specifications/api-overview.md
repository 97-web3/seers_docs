---
标题：API 概述
版本：0.1
最后更新：2025-12-14
所有者：产品与工程部
状态：草稿
---

# API 概述

## 1. 目的
定义支持体育预测市场体验所需的技术无关的 API 合同。模块文档引用这些合同以实现可实施的互操作性。

## 2. 基本约定
- 基础路径：`/api`
- 传输：HTTPS
- 数据格式：JSON (`application/json`)
- 时间格式：ISO 8601 UTC（例如，`2025-12-14T13:21:00Z`）
- 金额格式：十进制数字，相关时附带货币代码

## 3. 版本控制
- API 应支持通过路径（例如，`/api/v1/...`）或标头进行显式版本控制。本 SRD 为清晰起见使用 `/api/...`；如果引入版本控制，则必须在所有端点中保持一致。

## 4. 身份验证和授权
请参阅 `cross-cutting-concerns/authentication-and-authorization.md`。

通用标头（如果已通过身份验证）：
- `Authorization: Bearer <token>`

## 5. 幂等性
对于改变状态的端点（下注、创建市场），客户端必须发送一个幂等性键：
- 标头：`Idempotency-Key: <opaque-unique-string>`

## 6. 分页
列表端点应支持以下之一：
- 基于页码：`page`、`pageSize`
- 基于游标：`cursor`、`limit`

本 SRD 在示例中使用基于页码的方式；实现可以根据需要选择基于游标的方式，但必须保持一致的文档记录。

## 7. 速率限制
如果实施了速率限制，API 必须提供：
- 稳定的错误代码（例如，`RATE_LIMITED`）
- 可选的指示重试时间的标头（实现定义）

## 8. 错误格式
所有非 2xx 响应必须遵循 `api-specifications/common-errors.md` 中的标准封装。