# Agent 协作说明

## 项目信息
- **项目名**: Cute Asuka
- **部署地址**: https://cute-asuka.onrender.com/
- **技术栈**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4 + Framer Motion
- **部署平台**: Render (Static Site)
- **当前版本**: v1.7 (2026-07-18)

## 协作规范
1. **严格遵循已有的前端架构和样式系统**。
2. **图片素材统一放在 `public/images`**；轮播桌面/移动分别放在 `public/web-banner/`、`public/sp-banner/`。
3. **提交信息使用详细中文**，例如：`feat(gallery): 增加置顶功能`。
4. **每次改动都要先 `npm run dev` 验证效果**。
5. **推送前运行 `npm run build` 确认无错误**（本地生成 `dist/` 即可，**不要把 `dist/` 提交进 Git**）。
6. **`dist/` 不入库**：由 Render 的 `npm install && npm run build` 生成；`.gitignore` 已忽略整个 `dist/`。
7. **图库数据单一来源**：列表/分类/标题/每日一图/详情 ID 均经 `src/lib/gallery.ts` 与 `/api/images`，勿再写假数据详情。

## 开发注意事项

### Next.js / Tailwind CSS
- **组件**：客户端组件使用 `"use client"`（轮播、主题、画廊、特效等）。
- **主题**：light/dark，`dark:` 前缀；`ThemeProvider` + `localStorage`。
- **动画**：Framer Motion；轮播注意 `mode="popLayout"`。
- **图片**：`next/image` + 静态导出时 `unoptimized: true`（见 `next.config.ts`）。
- **字阶工具类**：`type-kicker`、`type-body`、`font-display`（`globals.css`）。

### 轮播图（HeroCarousel）
- **文件**：`src/components/HeroCarousel.tsx`
- **素材**：`public/web-banner/`（桌面）、`public/sp-banner/`（移动）；数组在 `src/app/page.tsx`
- **显示**：`object-cover` + **`object-top`**（优先保留上方面部）
- **切换**：opacity 交叉淡入淡出；相邻图 `<link rel="preload">`
- **控件**：箭头与圆点需可点；勿被全屏文案层挡住（文案层用 `pointer-events-none`，按钮 `pointer-events-auto`）
- **首页文案**：叠在大屏**右下角**，无玻璃底板，仅字影 + 底部轻渐变

### 首页结构（`src/app/page.tsx`）
1. Hero 轮播 + 右下标题/按钮  
2. Narrative（信息即情绪）  
3. Stats（GIF / 静态 / 总计）  
4. Film Roll（**全部静态馆藏**双轨滚动，来自 `/api/images` 过滤非 gif）  
5. Portals（三扇门 → gallery / daily / about）  
6. CTA  

**已移除**：CRAFT STACK 技术展示条（对粉丝无用）。

### 图库与详情
- **共享逻辑**：`src/lib/gallery.ts`（`filesToItems`、`pickDailyItem`、分类、标题）
- **Gallery**：`PageShell`、粘性筛选、搜索、装裱瀑布、`Lightbox`（←→ / ESC）
- **详情**：`/gallery/[id]`，`generateStaticParams` 按 `public/images` 真实文件生成（约 200+ 页）
- **Daily**：日期种子 `YYYYMMDD % N`，与馆藏编号一致可进详情

### 特效（可选装饰，非业务必需）
- `AuroraField`：WebGL2 樱色极光（首页/部分区域；子页 `PageShell` 强度更低）
- `ScrollProgress`、`FilmStrip`、`CountUp`
- 尊重 `prefers-reduced-motion`

### 环境注意
- 若出现 Turbopack workspace root 警告（父目录另有 `package-lock.json`），可在 `next.config.ts` 配置 `turbopack.root` 或整理 monorepo 根。

## 部署方案

### Render（Static Site）

| 配置 | 值 |
|------|-----|
| 类型 | Static Site |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Branch | `master` |

- 仓库**只推源码**；构建在 Render 完成。  
- 不要依赖 Git 中的 `dist/` 作为发布源。

### 为何 Static Site
- 全站静态导出，无服务端运行时  
- 评论为前端会话暂存，无需数据库  
- 免费 + CDN  

### 构建配置
`next.config.ts`：`output: "export"`、`distDir: "dist"`、`images.unoptimized: true`

## 注意事项
- 静态导出下 API 为构建期/静态资源；动态持久化需改 Web Service  
- 新增 `public/images` 后需重新 build，详情静态路径才会更新  
- 提交前 build 通过即可，**勿** `git add dist`
