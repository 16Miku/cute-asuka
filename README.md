# Cute Asuka — 斋藤飞鸟可爱表情包展示站

> 🌸 乃木坂风格的可爱表情包小站，献给斋藤飞鸟  
> 在线访问：https://cute-asuka.onrender.com/

---

## 📖 项目概述

### 目标
- 展示斋藤飞鸟表情包：分类浏览、预览、下载、分享
- 视觉：粉白、克制、乃木坂气质
- 粉丝向精品小站，美观与好用并重

### 技术栈
| 类别 | 技术 |
|------|------|
| **框架** | Next.js 16 + React 19 + TypeScript |
| **样式** | Tailwind CSS v4 + Framer Motion |
| **特效** | WebGL2 极光背景（装饰层，非业务必需） |
| **部署** | Render Static Site（构建时生成 `dist`） |

**当前版本：v1.7**（2026-07-18）

---

## 🖥 功能特性

| 功能 | 描述 |
|------|------|
| 🎠 **首页 Hero** | 桌面/移动分素材轮播；`object-top` 优先露脸；右下叠字+按钮（无玻璃卡） |
| 🎞 **Film Roll** | 首页双轨滚动**全部静态馆藏**（非 gif） |
| 🖼 **表情包画廊** | 分类 / 搜索 / 装裱瀑布 / Lightbox（键盘切换）/ 详情深链 |
| 📄 **详情页** | 与 `/api/images` 同一排序的真实文件；下载、留言 |
| 📆 **每日一图** | 日期种子固定当日一帧，可进详情 |
| 💬 **留言板** | 前端暂存，会话级 |
| 🌗 **主题切换** | 浅/深色，localStorage |
| 📊 **馆藏统计** | 首页 GIF / 静态 / 总计 |

### 交互要点
- 响应式；Lightbox ESC / ← →
- 图片懒加载（画廊、胶片轨）
- 尊重 `prefers-reduced-motion`

---

## 🚀 部署

### 生产
- **平台**: [Render](https://render.com) — Static Site  
- **域名**: https://cute-asuka.onrender.com/  
- **流程**: 推送 `master` → Render 执行 build → 发布 `dist`

```
GitHub (源码) ──build──▶ dist/ ──▶ Render CDN
```

| 配置项 | 值 |
|--------|-----|
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Branch** | `master` |

### 构建配置（next.config.ts）
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
```

### 关于 `dist/`
- **不要提交到 Git**（已在 `.gitignore`）  
- 本地 `npm run build` 仅用于自检；线上由 Render 生成  

---

## 🛠 本地开发

```bash
git clone https://github.com/16Miku/cute-asuka.git
cd cute-asuka
npm install
npm run dev    # http://localhost:3000
```

| 命令 | 说明 |
|------|------|
| `npm run dev` | 开发（Turbopack） |
| `npm run build` | 静态导出到 `dist/` |
| `npm run lint` | ESLint |

---

## 📁 项目结构

```
cute-asuka/
├── public/
│   ├── images/                 # 表情包 (200+)
│   ├── web-banner/             # 桌面 Hero
│   └── sp-banner/              # 移动 Hero
├── src/
│   ├── app/
│   │   ├── page.tsx            # 首页
│   │   ├── gallery/
│   │   │   ├── page.tsx        # 画廊
│   │   │   └── [id]/           # 详情（静态路径 = 真实图数量）
│   │   ├── daily/page.tsx
│   │   ├── about/page.tsx
│   │   ├── globals.css
│   │   └── api/
│   │       ├── images/route.ts
│   │       └── comments/route.ts
│   ├── components/
│   │   ├── HeroCarousel.tsx
│   │   ├── Lightbox.tsx
│   │   ├── CommentBoard.tsx
│   │   ├── Navbar / Footer / Theme*
│   │   └── effects/            # Aurora、FilmStrip、PageShell 等
│   └── lib/
│       └── gallery.ts          # 图库单一数据源
├── docs/DEPLOYMENT.md
├── AGENT.md                    # Agent 协作规范
├── next.config.ts
└── package.json
```

---

## 📝 开发规范

- 客户端组件：`"use client"`
- 样式：Tailwind + 主题变量；`dark:` 适配深色
- 提交：语义化中文，如 `feat(gallery): …`
- 分支：`master`
- 轮播素材：桌面 `web-banner`、移动 `sp-banner`，在 `page.tsx` 数组中维护
- 图库逻辑：优先改 `src/lib/gallery.ts`，避免各页复制规则
- **勿提交 `dist/`**

---

## 🎨 素材说明

- **来源**: 粉丝收集，仅供学习交流  
- **格式**: JPG / PNG / GIF / WEBP  
- **目录**: `public/images/`（馆藏）、banner 目录（首页轮播）  

---

## 📅 更新日志

### v1.7 (2026-07-18) ⭐当前版本
- 🎠 首页大屏：`object-top` 铺满、去版本徽章；右下叠字+按钮（无玻璃板）
- 🎞 Film Roll 使用全部静态馆藏；滚动时长随数量变化
- 🗑 移除首页 CRAFT STACK 技术展示条
- 📦 **`dist/` 不再入库**，由 Render 构建生成

### v1.6 (2026-07-17)
- Gallery / Daily 标杆精修；`lib/gallery` 统一真实图库与详情静态路径
- Lightbox 与详情互链

### v1.5 (2026-07-17)
- 全站 PageShell、画廊搜索、玻璃拟态子页

### v1.4 (2026-07-17)
- 首页 WebGL 极光与滚动叙事单页

### v1.3 (2025-06-25)
- 轮播空白修复、预加载、移动端箭头

### v1.2 (2025-06-25)
- 轮播视觉与 Render 静态部署

### v1.1 (2025-06-24)
- Hero 轮播、大文件清理、API 缓存

### v1.0 (2025-06-24)
- 画廊 / 每日一图 / 留言 / 主题切换

---

## 🤝 交流

问题或建议欢迎提 Issue。内容仅供学习交流，与官方无关。
