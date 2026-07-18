# Agent 协作说明

## 项目信息
- **项目名**: Cute Asuka
- **部署地址**: https://cute-asuka.onrender.com/
- **技术栈**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- **部署平台**: Render (Static Site)
- **当前版本**: v1.6 (2026-07-17)

## 协作规范
1. **严格遵循已有的前端架构和样式系统**。
2. **图片素材统一放在 public/images**。
3. **提交信息使用详细中文**，例如：`feat(gallery): 增加置顶功能`。
4. **每次改动都要先 npm run dev 验证效果**。
5. **推送前运行 npm run build 确认无产出错误**。
6. **`dist/` 不入库**：部署时由 `npm run build` 生成；修改 `.gitignore` 后需同步 `git rm -r --cached` 清理已跟踪文件。

## 开发注意事项

### Next.js / Tailwind CSS 开发
- **组件**：客户端组件使用 `"use client"`（如 HeroCarousel.tsx、ThemeProvider.tsx 等）。
- **主题**：支持 light/dark 切换，使用 `dark:` 前缀适配深色模式。
- **动画**：使用 Framer Motion，注意 `mode="popLayout"` 避免布局抖动。
- **图片**：使用 `next/image` 的 `fill` + `object-cover`，静态导出需设置 `unoptimized: true`。

### 轮播图组件说明
- **文件**：`src/components/HeroCarousel.tsx`
- **素材目录**：`public/web-banner/`（桌面端）、`public/sp-banner/`（移动端）
- **切换效果**：纯 opacity 交叉淡入淡出（`initial={{ opacity: 0.3 }}` → `animate={{ opacity: 1 }}`）
- **预加载**：当前图片及相邻图片通过 `<link rel="preload">` 提前加载
- **移动端适配**：左右箭头 `hidden md:block` 已移除，所有设备均显示

### 沉浸体验（v1.4–v1.6）
- **首页**：`src/app/page.tsx` — 单页叙事（Hero / Narrative / Stats / Film / Portals / CTA）
- **全站壳层**：`PageShell` + `PageHeader` — 子页极光更淡，突出展品
- **图库单一数据源**：`src/lib/gallery.ts` + `/api/images`；详情 `generateStaticParams` 按真实文件生成
- **Gallery**：装裱瀑布、粘性筛选、Lightbox、深链 `/gallery/[id]`
- **Daily**：日期种子真图、胶片齿孔、下载/详情
- **样式**：`type-kicker` / `type-body`；玻璃拟态；`prefers-reduced-motion`

## 部署方案

### Render 部署
本项目使用 **Static Site** 部署，非 Web Service：

| 配置 | 值 |
|------|-----|
| 类型 | Static Site |
| Build Command | `npm install && npm run build` |
| Publish Directory | `dist` |
| Branch | `master` |

### 为什么用 Static Site 而非 Web Service？
- 本项目是静态网站（全站静态导出），没有服务端运行时需求
- Static Site 可免费部署，无需服务器费用
- 通过 CDN 加速，访问速度更快
- 评论数据是前端暂存，不需要后端数据库/持久化

### 构建配置
next.config.ts 已配置 `output: "export"` 和 `distDir: "dist"`

## 注意事项
- 静态导出时 API 路由会变为静态 JSON 文件
- 如需动态 API（如数据库持久化），需改用 Web Service
- 图片使用 `unoptimized: true` 适配静态导出
