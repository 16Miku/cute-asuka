# Agent 协作说明

## 项目信息
- **项目名**: Cute Asuka
- **部署地址**: https://cute-asuka.onrender.com/
- **技术栈**: Next.js 16 + React 19 + TypeScript + Tailwind CSS v4
- **部署平台**: Render (Static Site)

## 协作规范
1. **严格遵循已有的前端架构和样式系统**。
2. **图片素材统一放在 public/images**。
3. **提交信息使用详细中文**，例如：feat(gallery): 增加置顶功能。
4. **每次改动都要先 npm run dev 验证效果**。
5. **推送前运行 npm run build 确认无产出错误**。

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
