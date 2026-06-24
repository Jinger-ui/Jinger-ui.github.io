# 将 PRISM 部署到 GitHub Pages（与官方文档一致）

官方说明见：`docs/deployment.md`。下面是针对本仓库的常见两种情形。

## 事前准备

1. **Node.js ≥ 22**（与本项目 `engines` 一致）。
2. 仓库需为 **Public**（免费 GitHub Pages 对私有库有限制，除非你有付费套餐）。

---

## 情况 A：用户主页 `https://USERNAME.github.io/`（推荐）

仓库名必须为 **`USERNAME.github.io`**（`USERNAME` 换成你的 GitHub 用户名）。

1. 在 GitHub **新建仓库**，命名为 `USERNAME.github.io`。
2. 把 **`prism-portfolio` 文件夹里的全部内容**（含 `.github`、不要只传 `out`）推送到该仓库的 **`main`** 分支。  
   - 若你当前还没有 Git 仓库，可在 `prism-portfolio` 目录执行：
     ```bash
     git init
     git add .
     git commit -m "Initial PRISM site"
     git branch -M main
     git remote add origin https://github.com/USERNAME/USERNAME.github.io.git
     git push -u origin main
     ```
3. 打开仓库 **Settings → Pages**：
   - **Build and deployment → Source** 选择 **GitHub Actions**（不要选 “Deploy from a branch” + `/(root)` 传 `out` 的那套；我们已改用 Actions 自动生成 `out`）。
4. 打开 **Actions** 标签页，选中 **Deploy PRISM to GitHub Pages**：
   - 若提示需启用 workflow，按提示 **Enable workflow**；
   - 可用 **Run workflow** 手动跑一次；或直接向 `main` **push**，工作流会自动执行（已对 `push` 启用）。
5. Actions 成功后，几分钟后访问：**`https://USERNAME.github.io/`**。

本仓库已通过 **`public/.nojekyll`** 在构建时写入 `out/`，满足 GitHub 对 `_next` 目录的要求。

---

## 情况 B：项目主页 `https://USERNAME.github.io/REPO/`

若仓库名**不是** `USERNAME.github.io`（例如 `prism-portfolio`），必须为 Next 配置 **路径前缀**，否则静态资源路径会错位。

编辑 **`next.config.ts`**，取消注释并改成你的仓库名：

```ts
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath: "/你的仓库名",
  assetPrefix: "/你的仓库名",
  images: { unoptimized: true },
  // ...webpack
};
```

然后同样用 **GitHub Actions** 部署，`Settings → Pages → Source → GitHub Actions`。

---

## 纯手动上传 `out/`（不写 Actions）

对应官方 `deployment.md` 的「拖拽上传」方式：

```bash
cd prism-portfolio
npm install
npm run build
```

将 **`out` 文件夹里的所有文件** 上传到 **`USERNAME.github.io` 仓库的根目录**（或通过 Git 推到 `main`），并确保仓库根目录存在 **`.nojekyll`**（本仓库构建产物里已自带）。  
再在 **Pages** 里选 **Deploy from a branch**，分支 `main`，目录 **`/` (root)**。

---

## 常见问题

| 现象 | 处理 |
|------|------|
| 样式/JS 丢失、`_next` 404 | 确认根目录有 `.nojekyll`；若为子路径仓库，务必设置 `basePath` / `assetPrefix`。 |
| Actions 不报错但站点空白 | Pages 源是否改成了 **GitHub Actions**；是否等几分钟后重试无痕窗口。 |
| 构建失败 Node 版本 | Workflow 已使用 `node-version: 22`，一般无需改。 |

你的 GitHub 主页链接在简历里为 **https://github.com/Jinger-ui**，若使用用户站点，仓库名应为 **`Jinger-ui.github.io`**（访问时多为 **https://jinger-ui.github.io**）。
