# Cute Asuka - 粉丝向斋藤飞鸟可爱表情包展示站

## 项目目标
- 展示斋藤飞鸟表情包，支持分类浏览、预览、下载和分享。
- 采用乃木坂风格：克制、干净、粉白调。

## 本地运行
```bash
npm install
npm run dev
```

## 核心功能
- 表情包画廊 + Lightbox + 下载 + 分享链接
- 每日一图
- 关于项目页
- 浅色 / 深色模式切换
- 评论板（前端内存暂存）

## 素材说明
- 原始图库：`D:\乃木坂46\阿鸟表情包\鸟宝表情包`
- 部署图库：`cute-asuka/public/images/`
- 支持 JPG、PNG、GIF、WEBP

## 部署说明
- 主流方式：Render 免费方案
- 命令：npm run build && npm start

## 开发规范
- 客户端组件使用 `"use client"`
- 样式统一使用 Tailwind 与主题变量
- 提交信息使用详细中文，例如：docs: 添加中文 README 说明
