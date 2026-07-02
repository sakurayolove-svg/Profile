# 个人网站

https://sakurayolove-svg.github.io/Profile/

## 功能特性

- 四个子页面：简介、项目、知识、生活
- 每个页面支持添加/编辑/删除/拖拽排序条目
- 支持上传图片和 PDF 文件
- 图片支持灯箱查看、缩放、翻页
- PDF 支持浏览器内渲染、缩放、翻页、下载
- 数据导出/导入（JSON 备份）
- 响应式设计，支持移动端

## 技术栈

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router（HashRouter）
- @dnd-kit（拖拽排序）
- pdf.js（PDF 渲染）
- IndexedDB（本地数据存储）

## 本地部署

```bash
npm install
npm run dev
```

## 部署到 GitHub Pages

1. 仓库 Settings → Pages → Source 选择 GitHub Actions
2. 推送代码到 main 分支自动部署

## 数据备份

点击右上角设置图标导出/导入 JSON 备份。

> 数据存储在浏览器本地，请定期备份！
