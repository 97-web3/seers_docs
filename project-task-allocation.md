# Project Task Allocation — Seers Sports Prediction Markets

版本：0.1  
最后更新：2025-12-15  
所有者：TBD  
状态：Draft

## 1. 项目概述（基于现有文档与原型代码）

### 1.1 目标与范围
本项目要实现“体育预测市场”客户端与服务端能力：用户发现体育赛事/市场、查看市场详情（选项、趋势、规则、裁决）、下注交易、查看市场内持仓，以及以“庄家模式”创建市场。  
范围以 [docs/srd/](docs/srd/README.md) 为准；本任务分解仅覆盖**体育相关**能力（排除 [demo/](demo/README.md) 中“加密货币/娱乐”等非体育市场）。

### 1.2 当前资产（事实来源）
- PRD：[docs/prd/prd.md](docs/prd/prd.md)
- SRD（技术无关规范）：[docs/srd/README.md](docs/srd/README.md)（含 7 个模块、API 规范、数据模型、集成、UX、横切关注点）
- 前端 Demo 原型：[demo/](demo/README.md)（React + Vite + TypeScript；主要使用 [demo/constants.ts](demo/constants.ts) 的 MOCK 数据；页面状态在 [demo/App.tsx](demo/App.tsx) 内用 `useState` 管理；无真实后端 API 调用）

### 1.3 关键实现模块（来自 SRD）
- 赛事发现：[docs/srd/modules/01-event-discovery.md](docs/srd/modules/01-event-discovery.md)
- 市场详情：[docs/srd/modules/02-market-details.md](docs/srd/modules/02-market-details.md)
- 交易与投注：[docs/srd/modules/03-trading-and-betting.md](docs/srd/modules/03-trading-and-betting.md)
- 投资组合与持仓（市场内）：[docs/srd/modules/04-portfolio-and-positions.md](docs/srd/modules/04-portfolio-and-positions.md)
- 市场创建（庄家模式，MVP 单玩法）：[docs/srd/modules/05-market-creation-bookmaker.md](docs/srd/modules/05-market-creation-bookmaker.md)
- 市场状态与结算/裁决可见性：[docs/srd/modules/06-market-states-and-settlement.md](docs/srd/modules/06-market-states-and-settlement.md)
- 运维与配置：[docs/srd/modules/07-operations-and-configuration.md](docs/srd/modules/07-operations-and-configuration.md)

## 2. 关键路径（阻塞链）
下列任务完成后，才能实现端到端“发现 → 详情 → 报价 → 下注 → 持仓刷新”的最小闭环：
- [ ] INT-001（API 合同落地与可执行化）
- [ ] BE-001（API 基础设施：错误信封、requestId、认证门控）
- [ ] BE-003（核心数据模型与持久化）
- [ ] BE-004（体育数据接入 + Events API）
- [ ] BE-006（Markets 只读 API：发现/详情/选项）
- [ ] FE-001（前端 API Client + 错误处理）
- [ ] FE-005（赛事发现页面接入真实 API）
- [ ] FE-008（市场详情接入真实 API）
- [ ] BE-007（交易 Quote API）
- [ ] FE-010（投注报价展示与校验）
- [ ] BE-009（下注下单 + 幂等 + 钱包扣款）
- [ ] FE-011（下注提交流程 + 刷新）
- [ ] BE-010（Portfolio API）
- [ ] FE-013（持仓区接入 Portfolio API）

---

# 3. Frontend Tasks

## 3.1 基础与横切能力

### [ ] FE-001 — 前端 API Client 与标准错误处理
- 描述：建立统一的请求封装（`/api` 基础路径、鉴权头、`Idempotency-Key`、`requestId` 透传/生成、错误信封解析与错误码映射）。
- 验收标准：
  - 可配置 `baseUrl` 且默认指向 `/api`（见 [docs/srd/api-specifications/api-overview.md](docs/srd/api-specifications/api-overview.md)）。
  - 非 2xx 响应能解析 [docs/srd/api-specifications/common-errors.md](docs/srd/api-specifications/common-errors.md) 的标准错误信封并转换为 UI 可用结构（`code/message/fieldErrors/requestId`）。
  - 交易/创建类请求支持注入 `Idempotency-Key`。
- 依赖：None
- 优先级：P0
- 复杂度（Story Points）：3
- Assignee：TBD
- 相关文件/组件：[docs/srd/api-specifications/api-overview.md](docs/srd/api-specifications/api-overview.md), [docs/srd/api-specifications/common-errors.md](docs/srd/api-specifications/common-errors.md), [demo/App.tsx](demo/App.tsx)

### [ ] FE-002 — 认证状态与“登录门控”交互
- 描述：实现认证状态管理（登录/登出、token 存储策略待定），并在下注/创建等需要认证的入口触发交互式登录引导。
- 验收标准：
  - 未登录触发下注/创建时打开登录对话框/流程（见 [docs/srd/cross-cutting-concerns/authentication-and-authorization.md](docs/srd/cross-cutting-concerns/authentication-and-authorization.md)、[docs/srd/ux/navigation-and-state.md](docs/srd/ux/navigation-and-state.md)）。
  - 登录后恢复上下文（仍停留在当前市场/保留已输入金额，策略可在实现中定义并保持一致）。
- 依赖：FE-001
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/cross-cutting-concerns/authentication-and-authorization.md](docs/srd/cross-cutting-concerns/authentication-and-authorization.md), [docs/srd/ux/navigation-and-state.md](docs/srd/ux/navigation-and-state.md), [demo/components/LoginModal.tsx](demo/components/LoginModal.tsx), [demo/App.tsx](demo/App.tsx)

### [ ] FE-003 — 配置拉取与本地缓存（fee/sports/play-types 等）
- 描述：实现对运营配置端点的拉取与缓存（含版本字段），为发现排序、玩法配置、费率等提供数据源与回退策略。
- 验收标准：
  - 能读取 [docs/srd/api-specifications/operations.md](docs/srd/api-specifications/operations.md) 中至少：`/api/config/fee-rate`、`/api/config/featured-markets`、`/api/config/pinned-weights`（其他按模块需要逐步接入）。
  - 配置不可用时按 SRD 定义回退（例如费率默认 0.2%，无特色市场，置顶权重=0）。
- 依赖：FE-001
- 优先级：P0
- 复杂度：3
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/07-operations-and-configuration.md](docs/srd/modules/07-operations-and-configuration.md), [docs/srd/api-specifications/operations.md](docs/srd/api-specifications/operations.md)

### [ ] FE-004 — 全局加载/空/错误态与提示（Toast/Modal）
- 描述：将 [docs/srd/ux/*](docs/srd/ux/loading-empty-error-states.md) 与 [docs/srd/cross-cutting-concerns/error-handling-and-messaging.md](docs/srd/cross-cutting-concerns/error-handling-and-messaging.md) 的 UX 规范落为可复用组件与统一模式。
- 验收标准：
  - 首页骨架屏、详情页分区加载、提交按钮 loading、防重复提交覆盖到发现/详情/下注/创建主要路径。
  - 余额不足弹窗包含充值入口；网络错误包含重试入口；“市场已结束/已取消”等状态有一致文案与禁用行为。
- 依赖：FE-001
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/ux/loading-empty-error-states.md](docs/srd/ux/loading-empty-error-states.md), [docs/srd/cross-cutting-concerns/error-handling-and-messaging.md](docs/srd/cross-cutting-concerns/error-handling-and-messaging.md), [demo/components/BetModal.tsx](demo/components/BetModal.tsx)

## 3.2 赛事发现（体育主页）

### [ ] FE-005 — 赛事发现页：数据接入与筛选联动
- 描述：将体育主页从 MOCK 数据切换为 SRD 定义的发现 API；实现“特色/热门 + 全部列表 + 体育分类筛选”。
- 验收标准：
  - 可加载体育类别：`GET /api/sports`（用于筛选与数量展示）。
  - 可加载特色市场：`GET /api/markets/featured?limit=3`；不可用时按 MVP 降级（显示列表前 3 个或空态，见 [docs/srd/modules/01-event-discovery.md](docs/srd/modules/01-event-discovery.md)）。
  - 可加载市场列表：`GET /api/markets?status=active&sportId={...}` 并按 SRD 规则显示标题与计数。
- 依赖：FE-001, FE-003
- 优先级：P0
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/01-event-discovery.md](docs/srd/modules/01-event-discovery.md), [docs/srd/api-specifications/markets.md](docs/srd/api-specifications/markets.md), [docs/srd/api-specifications/events.md](docs/srd/api-specifications/events.md), [demo/App.tsx](demo/App.tsx), [demo/components/Sidebar.tsx](demo/components/Sidebar.tsx)

### [ ] FE-006 — 市场卡片组件对齐 SRD（预览/锁定/状态标签）
- 描述：统一市场卡片（对战/冠军两种），并对齐：选项预览最多 4 + “更多投注项 +N”、颜色规则、庄家锁定选项不可投注、状态标签来源于 `MarketState`。
- 验收标准：
  - 选项预览规则符合 [docs/srd/modules/01-event-discovery.md](docs/srd/modules/01-event-discovery.md)（≤4 全显；≥5 显示 4 + “更多投注项 +N”）。
  - `locked=true` 或庄家侧（bookmakerSide）选项不可点击下注，且有明确提示。
  - 状态标签从 API `state` 渲染（ACTIVE/CLOSED/SETTLED/DISPUTED/CANCELLED）。
- 依赖：FE-005
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/01-event-discovery.md](docs/srd/modules/01-event-discovery.md), [docs/srd/modules/06-market-states-and-settlement.md](docs/srd/modules/06-market-states-and-settlement.md), [demo/components/MarketCard.tsx](demo/components/MarketCard.tsx)

### [ ] FE-007 — Sidebar 体育分类/联赛筛选对齐（含“再次点击取消选择”）
- 描述：实现 SRD 要求的筛选交互与联赛二级筛选“再次点击取消选择”行为，并确保“全部体育”不混入非体育市场。
- 验收标准：
  - “全部体育”仅聚合已配置体育类别下的市场（见 [docs/srd/modules/01-event-discovery.md](docs/srd/modules/01-event-discovery.md) BR-ED-006）。
  - 联赛筛选支持 toggle 取消（见 [docs/srd/ux/navigation-and-state.md](docs/srd/ux/navigation-and-state.md)）。
- 依赖：FE-005
- 优先级：P1
- 复杂度：3
- Assignee：TBD
- 相关文件/组件：[docs/srd/ux/navigation-and-state.md](docs/srd/ux/navigation-and-state.md), [demo/components/Sidebar.tsx](demo/components/Sidebar.tsx), [demo/constants.ts](demo/constants.ts)

## 3.3 市场详情（趋势/规则/裁决）

### [ ] FE-008 — 市场详情页：整合详情/选项/规则/裁决/结算数据
- 描述：将详情页数据切换为 Markets API；实现选项列表选择联动投注面板；并按状态禁用操作。
- 验收标准：
  - 支持加载：`GET /api/markets/{marketId}`、`/options`、`/rules`、`/adjudication`、`/settlement`（见 [docs/srd/modules/02-market-details.md](docs/srd/modules/02-market-details.md)、[docs/srd/api-specifications/markets.md](docs/srd/api-specifications/markets.md)）。
  - 选项列表显示：名称、份额/比例、已支持金额、十进制赔率（如可用），并支持选中态。
  - 非 ACTIVE 状态时禁用下注入口（见 [docs/srd/modules/06-market-states-and-settlement.md](docs/srd/modules/06-market-states-and-settlement.md)）。
- 依赖：FE-001, FE-003, FE-004
- 优先级：P0
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/02-market-details.md](docs/srd/modules/02-market-details.md), [docs/srd/api-specifications/markets.md](docs/srd/api-specifications/markets.md), [demo/components/MarketDetail.tsx](demo/components/MarketDetail.tsx)

### [ ] FE-009 — 趋势图：对接 price-history 并支持时间范围
- 描述：用真实时间序列渲染多线趋势图，支持 1H/1D/1W/1M/ALL。
- 验收标准：
  - 调用 `GET /api/markets/{marketId}/price-history?range=...` 并按时间戳升序渲染（见 [docs/srd/modules/02-market-details.md](docs/srd/modules/02-market-details.md)）。
  - 图表不可用时，选项列表仍可用且显示非阻塞错误态。
- 依赖：FE-008
- 优先级：P1
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/02-market-details.md](docs/srd/modules/02-market-details.md), [demo/components/MarketDetail.tsx](demo/components/MarketDetail.tsx)

## 3.4 交易/投注 + 持仓

### [ ] FE-010 — 报价展示：对接 Quote API + 约束与费用一致性
- 描述：投注金额或选项变化时请求报价；展示 stake、oddsDecimal、potentialReturn、fee、netProfit、约束（min/max/10%流动性）。
- 验收标准：
  - 调用 `POST /api/trading/quote` 并展示 [docs/srd/api-specifications/trading.md](docs/srd/api-specifications/trading.md) 响应字段。
  - UI 禁用/提示逻辑覆盖：未选项/金额为 0/余额不足/超出约束/市场非 ACTIVE/选项锁定。
- 依赖：FE-001, FE-003, FE-008
- 优先级：P0
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/03-trading-and-betting.md](docs/srd/modules/03-trading-and-betting.md), [docs/srd/api-specifications/trading.md](docs/srd/api-specifications/trading.md), [demo/components/MarketDetail.tsx](demo/components/MarketDetail.tsx), [demo/components/BetModal.tsx](demo/components/BetModal.tsx)

### [ ] FE-011 — 下注提交：幂等、loading、防重复、刷新
- 描述：提交下注到 Bets API；处理成功/失败/可重试；成功后触发市场与持仓刷新。
- 验收标准：
  - `POST /api/trading/bets` 带 `Idempotency-Key`；按钮提交期间显示 loading 且不可重复点击。
  - 成功后刷新：市场流动性、赔率/份额展示、持仓、趋势（刷新策略在实现中定义并记录）。
  - 失败时保留用户输入并展示基于错误码的提示（见 [docs/srd/cross-cutting-concerns/error-handling-and-messaging.md](docs/srd/cross-cutting-concerns/error-handling-and-messaging.md)）。
- 依赖：FE-010
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/03-trading-and-betting.md](docs/srd/modules/03-trading-and-betting.md), [docs/srd/cross-cutting-concerns/error-handling-and-messaging.md](docs/srd/cross-cutting-concerns/error-handling-and-messaging.md)

### [ ] FE-012 — 余额不足路径：充值入口对齐
- 描述：实现余额不足时的统一弹窗/页面，并提供充值入口（内部路由或外部跳转策略待定）。
- 验收标准：
  - 当 Quote 或 Bet 返回 `INSUFFICIENT_BALANCE` 时触发余额不足 UI（见 [docs/srd/api-specifications/common-errors.md](docs/srd/api-specifications/common-errors.md)、[docs/srd/ux/loading-empty-error-states.md](docs/srd/ux/loading-empty-error-states.md)）。
  - 充值入口可配置（见 [docs/srd/integrations/wallet-and-payments.md](docs/srd/integrations/wallet-and-payments.md)）。
- 依赖：FE-004, FE-010
- 优先级：P0
- 复杂度：3
- Assignee：TBD
- 相关文件/组件：[docs/srd/integrations/wallet-and-payments.md](docs/srd/integrations/wallet-and-payments.md), [demo/components/BetModal.tsx](demo/components/BetModal.tsx)

### [ ] FE-013 — “我的持仓”区域：Portfolio API 对接 + 对冲提示
- 描述：在市场详情中渲染持仓摘要与列表；根据持仓结构触发对冲提示；处理空态与结算态展示。
- 验收标准：
  - 调用 `GET /api/portfolio/markets/{marketId}/summary` 与 `/positions` 并渲染（见 [docs/srd/modules/04-portfolio-and-positions.md](docs/srd/modules/04-portfolio-and-positions.md)）。
  - `hasHedgedExposure=true` 时显示对冲提示；否则不展示或展示非干扰提示（策略需一致）。
- 依赖：FE-008
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/04-portfolio-and-positions.md](docs/srd/modules/04-portfolio-and-positions.md), [docs/srd/api-specifications/portfolio.md](docs/srd/api-specifications/portfolio.md), [demo/components/MarketDetail.tsx](demo/components/MarketDetail.tsx)

## 3.5 市场创建（庄家模式）

### [ ] FE-014 — 创建市场：入口/步骤框架 + 体育数据联动（类别/联赛/赛事/队伍）
- 描述：建立全屏创建流程的基础步骤与状态机；对接体育数据（sport/league/event/participants），并实现冠军/对战两类赛事的基础联动。
- 验收标准：
  - `GET /api/sports`、`/api/leagues`、`/api/events` 驱动下拉选择，且 enabled=false 的项不可选。
  - HEAD_TO_HEAD：队伍信息从事件元数据只读展示；CHAMPION：展示可编辑参与者列表并与表单保持一致（见 [docs/srd/modules/05-market-creation-bookmaker.md](docs/srd/modules/05-market-creation-bookmaker.md)）。
  - 关闭创建模态不影响体育主页筛选状态（见 [docs/srd/ux/navigation-and-state.md](docs/srd/ux/navigation-and-state.md)）。
- 依赖：FE-001, FE-002, FE-004
- 优先级：P0
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/api-specifications/events.md](docs/srd/api-specifications/events.md), [docs/srd/modules/05-market-creation-bookmaker.md](docs/srd/modules/05-market-creation-bookmaker.md), [demo/components/CreateMarketModal.tsx](demo/components/CreateMarketModal.tsx)

### [ ] FE-015 — 创建市场：玩法配置 UI + 校验（MVP 单玩法）
- 描述：对接玩法配置与趣味玩法配置；实现 FUN/OU/HDP/CS/CHAMPION 的 UI 与关键校验；MVP 强制单玩法（只允许一个 play）。
- 验收标准：
  - 玩法配置来源于 `GET /api/config/play-types` 与 `GET /api/config/fun-plays`（见 [docs/srd/api-specifications/market-creation.md](docs/srd/api-specifications/market-creation.md)）。
  - OU/HDP 步长为 0.5 且不允许整数；CS 仅 FULL_MATCH，支持 2–32 个唯一比分选项；冠军赛事禁用 period 切换并强制 CHAMPION 趣味玩法（见 [docs/srd/modules/05-market-creation-bookmaker.md](docs/srd/modules/05-market-creation-bookmaker.md)）。
  - 表单校验能给出字段级提示（与 `VALIDATION_FAILED.details.fieldErrors` 的展示策略兼容）。
- 依赖：FE-003, FE-014
- 优先级：P0
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/api-specifications/market-creation.md](docs/srd/api-specifications/market-creation.md), [docs/srd/modules/05-market-creation-bookmaker.md](docs/srd/modules/05-market-creation-bookmaker.md)

### [ ] FE-016 — 创建市场：封面媒体 + 提交/确认/成功跳转
- 描述：对接封面预设/上传；实现确认步骤；提交创建市场请求并处理余额不足/校验失败/成功跳转。
- 验收标准：
  - 可使用 `GET /api/media/presets?type=market-cover` 与 `POST /api/media/uploads` 选择/上传封面（见 [docs/srd/integrations/media-storage.md](docs/srd/integrations/media-storage.md)）。
  - 提交 `POST /api/markets` 时强制 `plays` 恰好 1；请求带 `Idempotency-Key`；成功后跳转到新市场详情页并刷新发现列表（见 [docs/srd/api-specifications/market-creation.md](docs/srd/api-specifications/market-creation.md)）。
  - 余额不足与其他错误按统一错误处理与 UX 规范展示（见 [docs/srd/ux/loading-empty-error-states.md](docs/srd/ux/loading-empty-error-states.md)）。
- 依赖：FE-015
- 优先级：P0
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/api-specifications/market-creation.md](docs/srd/api-specifications/market-creation.md), [docs/srd/integrations/media-storage.md](docs/srd/integrations/media-storage.md), [demo/components/CreateMarketModal.tsx](demo/components/CreateMarketModal.tsx)

### [ ] FE-017 — 前端测试：关键路径用例与回归
- 描述：为“发现→详情→报价→下注→持仓刷新→创建市场”建立可重复的测试集（单元/集成/E2E 策略由团队选择）。
- 验收标准：
  - 覆盖至少：错误信封映射、余额不足、市场非 ACTIVE 禁用、单玩法约束、对冲提示触发/不触发。
  - 测试用例与 SRD 的验收标准建立可追溯映射（任务内产出一份映射清单，放在代码仓库测试目录内或测试系统内；位置由团队决定）。
- 依赖：FE-005, FE-008, FE-010, FE-016
- 优先级：P1
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/01-event-discovery.md](docs/srd/modules/01-event-discovery.md), [docs/srd/modules/03-trading-and-betting.md](docs/srd/modules/03-trading-and-betting.md), [docs/srd/modules/05-market-creation-bookmaker.md](docs/srd/modules/05-market-creation-bookmaker.md)

---

# 4. Backend Tasks

## 4.1 平台基础能力

### [ ] BE-001 — API 基础设施：标准错误信封、requestId、版本/契约落位
- 描述：实现 SRD 要求的 API 基础约定：`/api`、JSON、UTC 时间格式、标准错误信封、`requestId` 贯通。
- 验收标准：
  - 所有非 2xx 按 [docs/srd/api-specifications/common-errors.md](docs/srd/api-specifications/common-errors.md) 返回错误信封，含 `requestId`。
  - 记录结构化日志并能按 `requestId` 追踪（见 [docs/srd/cross-cutting-concerns/observability.md](docs/srd/cross-cutting-concerns/observability.md)）。
- 依赖：None
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/api-specifications/api-overview.md](docs/srd/api-specifications/api-overview.md), [docs/srd/api-specifications/common-errors.md](docs/srd/api-specifications/common-errors.md), [docs/srd/cross-cutting-concerns/observability.md](docs/srd/cross-cutting-concerns/observability.md)

### [ ] BE-002 — 认证与授权（User/Creator/Operator）
- 描述：实现认证校验与授权策略（至少覆盖下注、创建市场、访问个人持仓/钱包等）。
- 验收标准：
  - 未认证访问受保护端点返回 `UNAUTHENTICATED`；无权限返回 `UNAUTHORIZED`（见 [docs/srd/api-specifications/common-errors.md](docs/srd/api-specifications/common-errors.md)）。
  - 用户只能访问自己的钱包/下注/持仓数据（见 [docs/srd/cross-cutting-concerns/security-and-compliance.md](docs/srd/cross-cutting-concerns/security-and-compliance.md)）。
- 依赖：BE-001
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/cross-cutting-concerns/authentication-and-authorization.md](docs/srd/cross-cutting-concerns/authentication-and-authorization.md), [docs/srd/cross-cutting-concerns/security-and-compliance.md](docs/srd/cross-cutting-concerns/security-and-compliance.md)

### [ ] BE-003 — 核心数据模型与持久化（市场/玩法/选项/下注/持仓/裁决）
- 描述：落地 SRD 数据实体与关系，并实现必要索引以支持发现与详情查询性能。
- 验收标准：
  - 实体覆盖至少：SportCategory, League, Event, PredictionMarket, Play, MarketOption, BetOrder, Position, Adjudication（见 [docs/srd/data-models/entities.md](docs/srd/data-models/entities.md)）。
  - 支持按 sportId/state 查询 markets 列表、按 marketId 查询详情与选项、按 userId+marketId 查询持仓。
- 依赖：BE-001
- 优先级：P0
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/data-models/entities.md](docs/srd/data-models/entities.md), [docs/srd/data-models/enumerations.md](docs/srd/data-models/enumerations.md)

## 4.2 外部依赖适配与只读能力

### [ ] BE-004 — 体育数据接入 + Events API（/sports /leagues /events）
- 描述：接入体育数据提供方（或实现可替换的适配层），并按 SRD 形状向客户端暴露分类/联赛/赛事/参与者。
- 验收标准：
  - 实现 [docs/srd/api-specifications/events.md](docs/srd/api-specifications/events.md) 所有端点，并遵守 enabled 约束。
  - HEAD_TO_HEAD 赛事参与者恰好 2；CHAMPION 赛事可返回空 participants 并保持稳定 eventId。
- 依赖：BE-001, BE-003
- 优先级：P0
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/integrations/sports-data.md](docs/srd/integrations/sports-data.md), [docs/srd/api-specifications/events.md](docs/srd/api-specifications/events.md)

### [ ] BE-005 — 运营配置 API（featured/pinned/fee-rate + 版本化）
- 描述：实现运营配置读取端点，为客户端提供特色市场、置顶权重、费率等配置与版本字段。
- 验收标准：
  - 实现 [docs/srd/api-specifications/operations.md](docs/srd/api-specifications/operations.md) 中端点（至少 featured、pinned、fee-rate），并带可用于调试的 `version`。
  - 配置不可用时系统能回退到安全默认值（见 [docs/srd/integrations/admin-operations.md](docs/srd/integrations/admin-operations.md)）。
- 依赖：BE-001
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/api-specifications/operations.md](docs/srd/api-specifications/operations.md), [docs/srd/integrations/admin-operations.md](docs/srd/integrations/admin-operations.md)

### [ ] BE-006 — Markets 只读 API（发现/详情/选项/趋势/规则）
- 描述：实现 Markets API 读端点，支撑发现与详情体验；并正确暴露市场状态与关键字段。
- 验收标准：
  - 实现 [docs/srd/api-specifications/markets.md](docs/srd/api-specifications/markets.md) 中：`GET /api/markets`、`/featured`、`/markets/{id}`、`/options`、`/price-history`、`/rules`。
  - `state/mode/createdBy/totalLiquidity/participantCount/cutoffTime` 等字段存在且语义一致。
  - `locked=true` 的 option 在 options 响应中体现。
- 依赖：BE-003, BE-005
- 优先级：P0
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/api-specifications/markets.md](docs/srd/api-specifications/markets.md), [docs/srd/modules/06-market-states-and-settlement.md](docs/srd/modules/06-market-states-and-settlement.md)

## 4.3 交易与钱包

### [ ] BE-007 — Trading Quote API（费用端到端一致 + 约束下发）
- 描述：实现 `POST /api/trading/quote`，返回 `oddsDecimal/potentialReturn/fee/netProfit/constraints` 并与 UI 计算保持一致。
- 验收标准：
  - 报价计算遵循 [docs/srd/modules/03-trading-and-betting.md](docs/srd/modules/03-trading-and-betting.md)（`potentialReturn = stake * oddsDecimal`；`fee=stake*feeRate`；`netProfit=potentialReturn-stake-fee`）。
  - 约束下发覆盖：minStake、maxStakeByBalance、maxStakeByLiquidity（10% 流动性）。
  - 对于不可交易状态返回 `MARKET_CLOSED` 或等价稳定错误码。
- 依赖：BE-001, BE-002, BE-003, BE-005, BE-006
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/api-specifications/trading.md](docs/srd/api-specifications/trading.md), [docs/srd/modules/03-trading-and-betting.md](docs/srd/modules/03-trading-and-betting.md)

### [ ] BE-008 — 钱包适配层 + 余额端点（/api/wallet/balance）
- 描述：实现钱包/支付集成适配层（外部或内部），并对客户端暴露余额读取；为下注/创建提供扣款能力。
- 验收标准：
  - 提供 `GET /api/wallet/balance`（被 SRD 交易模块引用）并要求认证。
  - 扣款能力满足幂等性，并能返回 `INSUFFICIENT_BALANCE`。
- 依赖：BE-001, BE-002
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/integrations/wallet-and-payments.md](docs/srd/integrations/wallet-and-payments.md), [docs/srd/modules/03-trading-and-betting.md](docs/srd/modules/03-trading-and-betting.md)

### [ ] BE-009 — Bet 下单（幂等、扣款=stake+fee、更新市场与持仓）
- 描述：实现 `POST /api/trading/bets` 与 `GET /api/trading/bets/{betId}`；确保幂等、资金完整性、并更新市场聚合与用户持仓。
- 验收标准：
  - `POST /api/trading/bets` 支持 `Idempotency-Key`，重复提交不重复扣款与重复创建订单。
  - 实际扣款为 `stake + fee`（见 [docs/srd/modules/03-trading-and-betting.md](docs/srd/modules/03-trading-and-betting.md) FR-TB-014）。
  - 成功下注后：创建 BetOrder、更新/创建 Position、更新市场 totalLiquidity 与 options sharePct（口径定义在实现中保持一致）。
- 依赖：BE-007, BE-008
- 优先级：P0
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/api-specifications/trading.md](docs/srd/api-specifications/trading.md), [docs/srd/data-models/entities.md](docs/srd/data-models/entities.md)

## 4.4 Portfolio / Positions

### [ ] BE-010 — Portfolio API（summary/positions + 对冲检测）
- 描述：实现市场维度的投资组合摘要与持仓列表端点，并提供对冲检测与最大潜在利润口径。
- 验收标准：
  - 实现 [docs/srd/api-specifications/portfolio.md](docs/srd/api-specifications/portfolio.md) 的两个端点。
  - `hasHedgedExposure` 与 `maxPotentialProfit` 计算可复现且在同一刷新周期内部一致（见 [docs/srd/modules/04-portfolio-and-positions.md](docs/srd/modules/04-portfolio-and-positions.md)）。
- 依赖：BE-002, BE-003, BE-009
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/04-portfolio-and-positions.md](docs/srd/modules/04-portfolio-and-positions.md), [docs/srd/api-specifications/portfolio.md](docs/srd/api-specifications/portfolio.md)

## 4.5 市场创建 + 媒体

### [ ] BE-011 — Media API（封面预设 + 上传）
- 描述：实现市场封面预设列表与上传（或预签名上传协商），并返回稳定的 `mediaId` 与 `url`。
- 验收标准：
  - `GET /api/media/presets?type=market-cover` 返回可用预设。
  - `POST /api/media/uploads` 返回 `{mediaId,url}`，并约束文件类型/大小符合 [docs/srd/integrations/media-storage.md](docs/srd/integrations/media-storage.md)。
- 依赖：BE-001, BE-002
- 优先级：P1
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/api-specifications/market-creation.md](docs/srd/api-specifications/market-creation.md), [docs/srd/integrations/media-storage.md](docs/srd/integrations/media-storage.md)

### [ ] BE-012 — 创建市场 API（庄家模式，MVP 单玩法）
- 描述：实现 `POST /api/markets`（创建市场），包含玩法校验、初始流动性扣款、option 生成与锁定庄家侧选项。
- 验收标准：
  - `plays` 数组**恰好 1 个**（见 [docs/srd/api-specifications/market-creation.md](docs/srd/api-specifications/market-creation.md) MVP 约束）。
  - 玩法校验覆盖：period/playType 合法、OU/HDP 步长与范围、CS 选项数量与唯一性、cutoffTime 合法等（见 [docs/srd/modules/05-market-creation-bookmaker.md](docs/srd/modules/05-market-creation-bookmaker.md)）。
  - 创建成功后市场可在发现列表中查询到；初始流动性被扣除或预留，且可审计。
- 依赖：BE-002, BE-003, BE-004, BE-005, BE-008, BE-011
- 优先级：P0
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/05-market-creation-bookmaker.md](docs/srd/modules/05-market-creation-bookmaker.md), [docs/srd/api-specifications/market-creation.md](docs/srd/api-specifications/market-creation.md), [docs/srd/data-models/json-schemas.md](docs/srd/data-models/json-schemas.md)

## 4.6 市场状态、裁决与结算可见性

### [ ] BE-013 — Adjudication/Settlement 读端点（UMA/Kleros 字段可用）
- 描述：实现 `GET /api/markets/{marketId}/adjudication` 与 `GET /api/markets/{marketId}/settlement`，并返回挑战期/争议/已决定等字段。
- 验收标准：
  - 响应字段符合 [docs/srd/api-specifications/markets.md](docs/srd/api-specifications/markets.md)（oracleProvider、arbitrationProvider、challengeWindowEndsAt、winningOptionIds 等）。
  - 市场状态与裁决状态之间的只读约束可被交易端点正确使用（例如 DISPUTED/CANCELLED 不可下注）。
- 依赖：BE-006
- 优先级：P1
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/06-market-states-and-settlement.md](docs/srd/modules/06-market-states-and-settlement.md), [docs/srd/integrations/oracle-and-dispute-resolution.md](docs/srd/integrations/oracle-and-dispute-resolution.md)

### [ ] BE-014 — 市场生命周期作业（ACTIVE→CLOSED→SETTLED + CANCELLED/DISPUTED）
- 描述：实现市场状态转换的服务器权威机制（定时/事件驱动策略由实现选择），并支持取消与争议状态。
- 验收标准：
  - 到达 cutoffTime 自动转 CLOSED；结算完成后转 SETTLED。
  - 满足“延期>24h”策略可转 CANCELLED 并记录原因（见 [docs/srd/modules/06-market-states-and-settlement.md](docs/srd/modules/06-market-states-and-settlement.md)）。
  - DISPUTED 状态下市场保持只读，直至裁决决定。
- 依赖：BE-003, BE-006, BE-013
- 优先级：P1
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/06-market-states-and-settlement.md](docs/srd/modules/06-market-states-and-settlement.md)

### [ ] BE-015 — 可观测性与审计（交易/创建/状态变更）
- 描述：为下注、创建、状态变更提供可追踪日志、指标与最低告警。
- 验收标准：
  - 指标覆盖：端点请求率/错误率/延迟、下注成功/失败（按错误码）、创建成功/失败（按校验类别）。
  - 至少告警：钱包依赖停机、下注失败率升高、市场列表失败率升高（见 [docs/srd/cross-cutting-concerns/observability.md](docs/srd/cross-cutting-concerns/observability.md)）。
- 依赖：BE-001, BE-009, BE-012
- 优先级：P1
- 复杂度：3
- Assignee：TBD
- 相关文件/组件：[docs/srd/cross-cutting-concerns/observability.md](docs/srd/cross-cutting-concerns/observability.md)

### [ ] BE-016 — 后端测试：合同测试 + 关键流程集成测试
- 描述：建立可自动化验证的测试集，覆盖契约（schema/示例）与关键交易流程。
- 验收标准：
  - Contract tests：Markets/Trading/Portfolio/MarketCreate 的响应满足 [docs/srd/data-models/json-schemas.md](docs/srd/data-models/json-schemas.md)（或等价的可执行 schema）。
  - 集成测试覆盖：报价约束、`stake+fee` 扣款、幂等键重复提交、权限校验、CLOSED/DISPUTED/CANCELLED 禁止下注。
- 依赖：BE-006, BE-007, BE-009, BE-010, BE-012, BE-014
- 优先级：P1
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/data-models/json-schemas.md](docs/srd/data-models/json-schemas.md), [docs/srd/api-specifications/trading.md](docs/srd/api-specifications/trading.md)

---

# 5. Integration / Cross-functional Tasks

### [ ] INT-001 — SRD API 合同“可执行化”（OpenAPI/Mock/契约测试基线）
- 描述：将 [docs/srd/api-specifications/*.md](docs/srd/api-specifications/api-overview.md) + [docs/srd/data-models/json-schemas.md](docs/srd/data-models/json-schemas.md) 提炼为可执行合同（例如 OpenAPI、Postman Collection、或 Mock Server），用于 FE/BE 并行开发与验收。
- 验收标准：
  - 至少覆盖：Events、Markets、Trading、Portfolio、Market Creation、Operations。
  - Mock/Contract 能被 FE 用于联调，且 BE 能以此作为合同测试基线。
- 依赖：None
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/api-specifications/api-overview.md](docs/srd/api-specifications/api-overview.md), [docs/srd/data-models/json-schemas.md](docs/srd/data-models/json-schemas.md)

### [ ] INT-002 — 体育数据 ID/映射与启用策略对齐
- 描述：明确 sports/leagues/events 的标识符策略、enabled 策略、以及冠军赛事表示，确保 FE/BE/数据提供方一致。
- 验收标准：
  - 对 `sportId/leagueId/eventId` 的来源、稳定性与变更策略有明确规则（可记录在实现 repo 的设计文档或配置中）。
  - CHAMPION/HEAD_TO_HEAD 的参与者结构在接口与数据源间一致。
- 依赖：INT-001
- 优先级：P0
- 复杂度：3
- Assignee：TBD
- 相关文件/组件：[docs/srd/integrations/sports-data.md](docs/srd/integrations/sports-data.md), [docs/srd/api-specifications/events.md](docs/srd/api-specifications/events.md)

### [ ] INT-003 — 钱包/支付集成方案落地（充值/提现入口 + 错误码）
- 描述：确认钱包提供方式（外部系统/内部模块）、余额与扣款一致性、以及充值/提现入口的 UX 与跳转策略。
- 验收标准：
  - `INSUFFICIENT_BALANCE`、幂等扣款、余额读取的行为在 FE/BE/钱包侧一致。
  - 充值与提现入口在前端可配置且不破坏认证/授权要求。
- 依赖：INT-001
- 优先级：P0
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/integrations/wallet-and-payments.md](docs/srd/integrations/wallet-and-payments.md), [docs/srd/api-specifications/common-errors.md](docs/srd/api-specifications/common-errors.md)

### [ ] INT-004 — UMA/Kleros 裁决可见性字段对齐与挑战期配置
- 描述：确认裁决数据来源/更新机制（轮询/事件）、挑战期配置来源，以及在 UI 的可读性表达。
- 验收标准：
  - `oracleProvider/arbitrationProvider/challengeWindowEndsAt/status` 字段可由后端稳定提供并与前端展示一致。
  - DISPUTED/DECIDED 状态与 MarketState 的联动规则达成一致并可验证。
- 依赖：INT-001
- 优先级：P1
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/integrations/oracle-and-dispute-resolution.md](docs/srd/integrations/oracle-and-dispute-resolution.md), [docs/srd/api-specifications/markets.md](docs/srd/api-specifications/markets.md)

### [ ] INT-005 — 端到端验收用例与 SRD 追踪矩阵（体育范围）
- 描述：建立 SRD 需求（FR/AC）到测试用例/验收步骤的映射，作为发布门禁。
- 验收标准：
  - 覆盖 7 个 SRD 模块的关键验收标准（至少 P0/P1）。
  - 每个用例可指出依赖的 API 与 UI 页面，并可被 QA/自动化复用。
- 依赖：INT-001
- 优先级：P1
- 复杂度：3
- Assignee：TBD
- 相关文件/组件：[docs/srd/modules/01-event-discovery.md](docs/srd/modules/01-event-discovery.md), [docs/srd/modules/03-trading-and-betting.md](docs/srd/modules/03-trading-and-betting.md), [docs/srd/modules/05-market-creation-bookmaker.md](docs/srd/modules/05-market-creation-bookmaker.md)

---

# 6. Infrastructure / DevOps Tasks

### [ ] DEV-001 — 本地开发环境编排（FE/BE/Mock/配置）
- 描述：提供统一的本地启动方式（前端、后端、可选 mock server），并规范环境变量与密钥注入方式。
- 验收标准：
  - 文档化启动命令与必要环境变量（至少覆盖：体育数据、钱包、媒体、运营配置、裁决依赖）。
  - FE 可在无外部依赖时通过 mock server 联调关键路径（与 INT-001 对齐）。
- 依赖：INT-001
- 优先级：P0
- 复杂度：3
- Assignee：TBD
- 相关文件/组件：[docs/srd/architecture/deployment-view.md](docs/srd/architecture/deployment-view.md), [demo/README.md](demo/README.md), [demo/vite.config.ts](demo/vite.config.ts)

### [ ] DEV-002 — CI（构建/测试/文档校验）
- 描述：建立持续集成：前端构建、后端测试、合同测试/Mock 校验、以及 SRD 文档链接/格式检查。
- 验收标准：
  - 合并门禁至少包含：FE build、BE test、contract test（若已实现）、[docs/srd/](docs/srd/README.md) 的 Markdown 链接校验。
- 依赖：FE-017, BE-016（可分阶段启用）
- 优先级：P1
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/README.md](docs/srd/README.md), [docs/srd/**](docs/srd/README.md)

### [ ] DEV-003 — Staging 部署（HTTPS/CORS/Secrets）
- 描述：提供可用于联调与验收的 staging 环境（前端应用 + 公共 API）。
- 验收标准：
  - HTTPS 可用；CORS 策略满足客户端访问；敏感配置通过安全机制注入。
  - 与 SRD 的“部署视图”一致且可追踪（见 [docs/srd/architecture/deployment-view.md](docs/srd/architecture/deployment-view.md)）。
- 依赖：BE-001, FE-005
- 优先级：P1
- 复杂度：8
- Assignee：TBD
- 相关文件/组件：[docs/srd/architecture/deployment-view.md](docs/srd/architecture/deployment-view.md)

### [ ] DEV-004 — 监控与告警落地（最低可用）
- 描述：落地可观测性要求：日志、指标、告警面板，优先覆盖交易与依赖停机。
- 验收标准：
  - 具备 SRD 最低告警项（钱包停机、下注失败率升高、市场列表失败率升高）。
- 依赖：BE-015
- 优先级：P1
- 复杂度：5
- Assignee：TBD
- 相关文件/组件：[docs/srd/cross-cutting-concerns/observability.md](docs/srd/cross-cutting-concerns/observability.md)
