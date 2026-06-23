# Cute Asuka — 斋藤飞鸟可爱表情包展示站

> 🌸 乃木坂风格的可爱表情包小站，献给斋藤飞鸟 
> 
> 在线访问：https://cute-asuka.onrender.com/

---

## 📖 项目概述

### 目标
- 展示斋藤飞鸟表情包，支持分类浏览、预览、下载和分享
- 采用乃木坂风格：克制、干净、粉白调
- 打造粉丝向精品小站，兼具美观与实用性

### 技术栈
| 类别 | 技术 |
|------|------|
| **框架** | Next.js 16 + React 19 + TypeScript |
| **样式** | Tailwind CSS v4 + Framer Motion |
| **部署** | Render (Static Site) |
| **CI/CD** | GitHub Actions |

---

## 🖥 功能特性

### 已实现功能

| 功能 | 描述 |
|------|------|
| 🎠 **首页轮播图** | 淡入淡出 Hero 背景，桌面端/移动端展示不同素材，自动切换 |
| 🖼 **表情包画廊** | 分类浏览（静态/动态）、Lightbox 预览、下载、分享 |
| 📆 **每日一图** | 基于日期种子随机挑选，每天展示不同表情包 |
| 💬 **留言板** | 支持评论互动（前端暂存，会话级别） |
| 🌗 **主题切换** | 浅色 / 深色模式，localStorage 持久化 |
| 📊 **实时统计** | 首页展示 GIF/静态图/总计数量 |

### 交互体验
- 响应式设计，完美适配移动端
- 键盘 ESC 关闭 Lightbox
- 图片懒加载，优化首屏性能
- Hover 动效和页面过渡动画

---

## 🚀 部署方案

### 生产环境
- **平台**: [Render](https://render.com) — Static Site
- **域名**: https://cute-asuka.onrender.com/
- **构建方式**: Static HTML Export (`next export`)

### 部署架构
```
GitHub Repo ──▶ Render ──▶ Static Site
   │                          │
   └─ CI/CD (GitHub Actions)  └─ CDN 加速
```

### Render 部署参数
| 配置项 | 值 |
|--------|-----|
| **Name** | cute-asuka |
| **Build Command** | `npm install && npm run build` |
| **Publish Directory** | `dist` |
| **Branch** | `master` |

### 构建配置 (next.config.ts)
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "dist",
  images: {
    unoptimized: true,  // 静态导出必需
  },
};

export default nextConfig;
```

---

## 🛠 本地开发

### 快速开始
```bash
# 克隆仓库
git clone https://github.com/16Miku/cute-asuka.git
cd cute-asuka

# 安装依赖
npm install

# 启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

### 常用命令
```bash
npm run dev      # 开发模式 (Turbopack, HMR)
npm run build    # 生产构建 (静态导出)
npm run start    # 预览生产构建
npm run lint     # ESLint 代码检查
```

---

## 📁 项目结构

```
cute-asuka/
├── public/
│   ├── images/              # 表情包素材 (200+)
│   ├── web-banner/          # 桌面端轮播图素材
│   └── sp-banner/           # 移动端轮播图素材
├── src/
│   ├── app/
│   │   ├── page.tsx            # 首页 (轮播图 Hero)
│   │   ├── gallery/page.tsx    # 画廊页
│   │   ├── daily/page.tsx      # 每日一图
│   │   ├── about/page.tsx      # 关于页
│   │   └── api/
│   │       ├── images/route.ts # 图片列表 API (静态)
│   │       └── comments/route.ts # 留言 API (静态)
│   ├── components/
│   │   ├── HeroCarousel.tsx    # 轮播图组件 ⭐新增
│   │   ├── Navbar.tsx          # 导航栏
│   │   ├── Footer.tsx          # 页脚
│   │   ├── CommentBoard.tsx    # 留言板
│   │   ├── ImageGrid.tsx       # 图片网格
│   │   ├── ThemeProvider.tsx   # 主题上下文
│   │   └── ThemeToggle.tsx     # 主题切换按钮
│   └── globals.css             # 全局样式 + 主题变量
├── next.config.ts              # Next.js 配置
├── package.json
└── README.md
```

---

## ⚡ 性能优化

### 本次迭代优化
| 优化项 | 描述 |
|--------|------|
| **大文件清理** | 删除 98MB 超大 GIF，解除 Git Push 限制 |
| **API 缓存** | images API 使用静态构建缓存，避免运行时读取磁盘 |
| **图片懒加载** | Gallery 图片添加 `loading="lazy"`，优化首屏 |
| **代码优化** | CommentBoard 空状态、加载状态、错误处理 |
| **轮播图响应式** | 桌面端/移动端分别展示不同比例素材（web-banner / sp-banner） |
| **Static Export** | 全站静态导出，适合 CDN 部署，极速加载 |

---

## 📝 开发规范

- **组件**: 客户端组件使用 `"use client"`
- **样式**: 统一使用 Tailwind CSS 与主题变量
- **提交信息**: 使用语义化中文提交，例如 `feat(gallery): 增加置顶功能`
- **分支**: 使用 `master` 主分支
- **轮播图素材规范**: 桌面端图片存放于 `public/web-banner/`，移动端图片存放于 `public/sp-banner/`，并在 `src/app/page.tsx` 中分别引入到 `desktopHeroImages` 和 `mobileHeroImages` 数组中

---

## 🎨 素材说明

- **来源**: 斋藤飞鸟粉丝收集
- **格式**: JPG、PNG、GIF、WEBP
- **总量**: 200+ 张
- **部署目录**: `public/images/`

---

## 📅 更新日志

### v1.0 (2025-06-24)
- ✅ 初始版本核心功能
- ✅ 表情包画廊 + Lightbox + 下载
- ✅ 每日一图、评论板、主题切换

### v1.2 (2025-06-25) ⭐当前版本
- 🎠 **轮播图视觉优化**
  - 降低暗色遮罩透明度（`from-black/20 via-black/10 to-black/40` → `from-black/5 via-transparent to-black/15`），图片更清晰明亮
  - 桌面端高度增加（`h-[85vh]` → `h-[92vh] + min-h-[600px]`），避免横屏图裁切显示不全
- 🚀 适配 Render 静态部署

### v1.1 (2025-06-24)
- 🎠 首页 Hero 背景改为轮播图（5 张精选，淡入淡出）
- 🗑 清理 98MB 大文件，Git 历史瘦身
- ⚡ API 性能优化（静态缓存）
- 🔧 Gallery 交互增强（ESC 关闭、懒加载）

---

## 🤝 技术交流

如有问题或建议，欢迎提交 Issue 或联系作者。

