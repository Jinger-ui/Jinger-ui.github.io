# 使用 PRISM 完整项目作为个人主页（Jingjia Huang）

本目录为官方仓库 **[xyjoey/PRISM](https://github.com/xyjoey/PRISM)** 的克隆，已把 `content/`、`public/avatar.svg` 等替换为你的简历信息，与根目录里纯静态的 `index.html` 独立并存。

## 环境要求

- **Node.js ≥ 22**（与 PRISM `package.json` 的 `engines` 一致）

## 常用命令

在项目根目录（`prism-portfolio`）下执行：

```bash
npm install
npm run dev
```

浏览器打开 **http://localhost:3000**（末尾带 `/` 亦可，项目配置了 `trailingSlash`）。

生产构建与静态导出（生成 `out/` 目录，可部署到 GitHub Pages / Cloudflare Pages 等）：

```bash
npm run build
```

**GitHub Pages 逐步说明（中文）：** 见 **`部署到GitHub-Pages.md`**（与官方 `docs/deployment.md` 对齐，含 Actions / 手动上传两种）。

详细英文部署指南见 **`docs/deployment.md`**。

## 已为你改动的文件（维护入口）

| 文件 | 作用 |
|------|------|
| `content/config.toml` | 站点标题、作者简介、社交链接、导航、`enable_one_page_mode`、关闭 i18n |
| `content/about.toml` | 首页版块：Bio、精选论文、News |
| `content/bio.md` | 首页自我介绍（Markdown） |
| `content/news.toml` | 首页时间线 |
| `content/publications.bib` | 论文（BibTeX；`selected = {true}` 会出现在首页「Selected」区块） |
| `content/projects.toml` | 项目卡片页 |
| `content/awards.toml` | 奖项卡片页 |
| `public/avatar.svg` | 头像占位（可换成你自己的 `bio.jpg` 等，并在 `config.toml` 里改 `[author].avatar`） |

联系方式在 **`config.toml` 的 `[social]`** 与首页 **Profile** 区块展示；未使用独立 CV 页。

如需 **中文**界面，可把上游的 `content_zh/` 对齐复制并再在 `config.toml` 打开 `[i18n]`（参见 PRISM README）。

## 与原静态页的关系

- 上一层目录的 **`index.html`**：无需 Node，双击或静态服务器即可；之前为模仿 PRISM 视觉的精简版。
- **本目录**：与上游 PRISM **同一套 Next.js / Tailwind / 动效**，可继续按官方文档加页、换主题、接入 `.bib`。

## 许可说明

PRISM 使用 MIT License；请保留上游 LICENSE 及对原作者的致谢。
