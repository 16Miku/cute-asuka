# 开发总结与部署方案

## 📋 开发总结

### 问题 1：大文件导致 Git Push 风险
**现象**: `public/images/屏幕录制 2025-12-21 005757.gif` 大小 98.30MB，接近 GitHub 100MB 硬限制
**影响**: Push 随时可能被拒绝，仓库体积膨胀至 457MB
**解决**:
1. 删除文件：`git rm "public/images/屏幕录制 2025-12-21 005757.gif"`
2. 清理 Git 历史：`git filter-branch --index-filter 'git rm -f ...'`
3. 重置 reflog：`git reflog expire --expire=now --all && git gc --prune=now --aggressive`

### 问题 2：首页 Hero 背景图单调
**优化**: 改为淡入淡出轮播图
- 新增 `HeroCarousel.tsx` 组件
- 5 张精选图片自动切换，6 秒间隔
- 支持左右箭头手动切换和底部指示点导航
- Framer Motion 驱动淡入淡出动画

### 问题 3：系统性能与体验待优化
**优化内容**:
- images API 改用静态构建缓存（`force-static`），避免运行时读取磁盘
- Gallery 图片添加 `loading="lazy"` 和 `sizes` 属性
- Lightbox 支持 ESC 关闭
- CommentBoard 增加空状态、加载状态、错误提示
- 移除 Edge API（`api/health`），避免静态导出冲突

### 问题 4：静态导出配置
**配置** (`next.config.ts`):
```typescript
const nextConfig: NextConfig = {
  output: "export",      // 静态导出
  distDir: "dist",      // 构建输出目录
  images: {
    unoptimized: true,  // 静态导出必需
  },
};
```

---

## 🚀 部署方案对比

### Static Site vs Web Service

| 特性 | Static Site | Web Service |
|------|-------------|-------------|
| **渲染方式** | 构建时预渲染 (Static HTML) | 服务端运行时 (Node.js/Python 等) |
| **API** | 不支持运行时 API | ✅ 支持服务端 API |
| **数据库** | ❌ 不支持 | ✅ 支持持久化数据库 |
| **费用** | 完全免费 | 免费额度有限 |
| **启动速度** | 无需启动 | 冷启动需等待 |
| **适用场景** | 博客、展示页、静态站点 | 需要后端逻辑的应用 |

### 本项目选型
- **选择**: `Static Site`
- **原因**:
  - 项目本质是静态展示站，没有动态后端需求
  - 评论板是前端暂存（Map），无需持久化
  - 免费且足够满足当前需求
  - 通过 CDN 加速，全球访问快

---

## 📊 部署架构

```
用户访问
    │
    ▼
CDN (Render Static Site 自带)
    │
    ▼
静态 HTML/JS/CSS (预构建)
    │
    ├──▶ HeroCarousel (Framer Motion)
    ├──▶ Gallery (懒加载图片)
    ├──▶ Daily (静态数据)
    └──▶ CommentBoard (前端暂存)
```

---

## ⚠️ 静态导出限制

1. **API 路由**: 变为静态 JSON 文件，请求时会返回构建时的快照
2. **动态路由**: 需显式声明 `generateStaticParams()`
3. **图片**: 必须设置 `images.unoptimized: true`
4. **数据库**: 无法使用，需另找方案（如 Supabase、MongoDB Atlas）

### 如需升级为 Web Service
- 去掉 `output: "export"` 和 `images.unoptimized`
- 添加数据库（如 Render PostgreSQL）
- API 使用 `force-dynamic` 或默认动态模式
- 需要持久化部署（非一次性构建）

---

## 📝 经验总结

### 关键决策
1. **大文件处理**: 及时清理，避免仓库污染
2. **静态导出 vs 运行时**: 展示类项目优先 Static Site
3. **API 设计**: 静态导出下 API 只能作为数据快照

### 最佳实践
- 图片、视频等大文件使用 CDN 或外部存储
- 使用 `force-static` 明确标记静态 API
- 提交前务必运行 `npm run build` 验证
- 保留 `generateStaticParams()` 签名供动态路由使用

---

**记录日期**: 2025-06-24
**项目版本**: v1.1
