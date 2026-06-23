# Cute Asuka - 粉丝向斋藤飞鸟可爱表情包展示站

## 项目目标
- 展示斋藤飞鸟表情包，支持分类浏览、预览、下载和分享。
- 采用乃木坂风格：克制、干净、粉白调。

## 技术栈
- **框架**: Next.js 16 + React 19 + TypeScript
- **样式**: Tailwind CSS v4 + Framer Motion
- **部署**: Static Export / Render

## 本地运行
```bash
npm install
npm run dev
# 访问 http://localhost:3000
```

## 核心功能
- **首页轮播图**: 淡入淡出效果的 Hero 背景轮播
- **表情包画廊**: 分类浏览、Lightbox 预览、下载、分享
- **每日一图**: 每天随机展示一张精选表情
- **留言板**: 支持评论互动（前端暂存）
- **主题切换**: 浅色 / 深色模式

## 部署说明

### Render 部署（推荐）
1. 在 [Render](https://render.com) 注册账号
2. 点击 **New +** → **Web Service**
3. 连接 GitHub 仓库 `16Miku/cute-asuka`
4. 配置：
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`（静态导出后不需要）
   - **Publish Directory**: `dist`
5. 点击 Deploy

### 静态部署
项目已配置 `output: "export"`，构建后会生成 `dist` 目录：
```bash
npm run build
# 部署 dist/ 目录到任意静态托管平台
```

## 开发规范
- 客户端组件使用 `"use client"`
- 样式统一使用 Tailwind 与主题变量
- 提交信息使用详细中文，例如：`feat(gallery): 增加置顶功能`

## 性能优化
- 图片 API 增加 LRU 缓存（5分钟）
- Gallery 图片懒加载
- GIF 大文件已清理，避免仓库臃肿

## 素材说明
- 部署图库：`cute-asuka/public/images/`
- 支持 JPG、PNG、GIF、WEBP
