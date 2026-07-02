# 个人网站

一个支持在线编辑、文件上传、图片/PDF预览的个人网站，数据存储在浏览器本地（IndexedDB），可导出备份。

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
- Vite（构建工具）
- Tailwind CSS（样式）
- React Router（路由）
- React Beautiful DnD（拖拽排序）
- pdf.js（PDF 渲染）
- IndexedDB（本地数据存储）

## 本地部署

```bash
# 1. 克隆仓库
git clone <你的仓库地址>
cd personal-website

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问 http://localhost:5173
```

## 构建部署

```bash
# 构建生产版本
npm run build

# 预览构建结果
npm run preview
```

## 部署到 GitHub Pages

1. 在 GitHub 创建仓库，上传代码
2. 进入仓库 Settings → Pages
3. Source 选择 "GitHub Actions"
4. 推送代码到 main 分支，自动触发部署
5. 访问 `https://<你的用户名>.github.io/personal-website/`

## 数据备份

点击右上角设置图标，可以：
- **导出备份**：将所有数据下载为 JSON 文件
- **导入备份**：从 JSON 文件恢复数据

> 注意：数据存储在浏览器本地，清除浏览器数据会丢失，请定期备份！

## 项目结构

```
personal-website/
├── src/
│   ├── components/     # UI 组件
│   ├── pages/          # 页面组件
│   ├── hooks/          # 自定义 Hooks
│   ├── stores/         # 数据存储（IndexedDB）
│   ├── types/          # TypeScript 类型
│   ├── App.tsx         # 主应用
│   └── main.tsx        # 入口
├── .github/workflows/  # GitHub Actions 部署
└── package.json
```

## License

MIT
