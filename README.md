# 魔术师小站

https://sakurayolove-svg.github.io/Profile/

## 特点

- 数据全部存在 Git 仓库里（`content/` 文件夹）
- 每个子页面一个文件夹，包含 `index.md` 和相关图片/PDF
- 使用 Python 静态站点生成器构建
- UI 风格参考 https://xuzhang0112.github.io/

## 目录结构

```
content/
├── home/
│   ├── index.md      # 首页资料、About Me 内容
│   └── avatar.png    # 头像
├── projects/
│   ├── index.md      # 项目页面组织方式
│   ├── project-a.png # 项目图片
│   └── paper.pdf     # 项目 PDF
├── knowledge/
│   └── index.md
└── life/
    └── index.md
```

## 编辑流程

1. 修改 `content/` 下对应文件夹的 `index.md`
2. 把图片、PDF 放到同一文件夹
3. 提交并推送到 GitHub
4. GitHub Actions 自动生成并部署站点

## 本地预览

```bash
pip install -r requirements.txt
python build.py --base /
python -m http.server 8000 -d dist
```

然后访问 http://localhost:8000

## 首页 index.md 字段

```yaml
---
name: 你的名字
bio: 侧边栏简介
about: |
  About Me 内容，支持 Markdown
email: xxx@example.com
location: 地点
avatar: avatar.png
siteTitle: 魔术师小站
aboutTitle: 关于我
socials:
  - name: GitHub
    url: https://github.com/xxx
---
```

## 子页面 index.md 字段

```yaml
---
title: 项目
description: 我的项目作品
icon: FolderGit
order: 0
items:
  - title: 项目 A
    content: 项目描述
    image: project-a.png
    links:
      - text: 论文
        url: https://arxiv.org/abs/xxx
---

自由内容区域，支持 Markdown。
```

同一文件夹下的图片和 PDF 会自动显示在页面底部。
