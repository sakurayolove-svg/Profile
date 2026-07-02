# Python 工具脚本

这里提供一些 Python 脚本，用于管理个人网站的数据备份。

## 环境要求

- Python 3.10+
- 无需额外依赖

## 脚本说明

### export_data.py

将浏览器导出的 JSON 备份转换为可读格式。

```bash
# 导出为 Markdown
python tools/export_data.py website-backup-2026-01-01.json -o site.md -f md

# 导出为整理后的 JSON
python tools/export_data.py website-backup-2026-01-01.json -o site.json -f json
```

### import_data.py

从 Markdown 文件生成浏览器可导入的 JSON 备份。

```bash
python tools/import_data.py content.md -o website-backup-new.json
```

Markdown 格式示例：

```markdown
# 张三

一名热爱 NLP 的研究者。

- 邮箱：zhangsan@example.com
- 地点：北京
- [GitHub](https://github.com/zhangsan)

## 项目

### 项目 A

项目 A 的详细介绍。

### 项目 B

项目 B 的详细介绍。

## 论文

### 论文 A

论文 A 的摘要。
```

### validate_backup.py

校验备份 JSON 格式是否正确。

```bash
python tools/validate_backup.py website-backup-2026-01-01.json
```
