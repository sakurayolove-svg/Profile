# Agent 约定

正式站点代码只有 `build.py`、`templates/`、`content/`、`static/`。一次性脚本、本地参考材料不进 GitHub。

- 项目正文与配图放在 `content/projects/<slug>/`（`index.md` + 图片）；首页只保留个人资料，由 `build.py` 扫描子目录生成 `projects/<slug>/` 详情页。
- `Tempo/`：临时脚本（例如按清单从 pptx / 文件夹拷图）。每条路径格式不同，不要写进 `build.py`。
- `refence/`、`Reference/`、`reference/`：本地参考（简历、幻灯片、证明材料替身），只在本机读取，不提交。
