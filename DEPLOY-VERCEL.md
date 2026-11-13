# Pet2Stitch Vercel 上线手册

日期：2026-11-14
状态：**未部署**。本机当前所有外部 HTTPS 均失败（见文末“网络问题”），Vercel API 连不上。配置已准备好，网络恢复后按下面执行即可。

## 一、已准备好的东西

- 仓库：`~/projects/threadform-mvp`，分支 `main`
- 最新 commit：`2a8c47e Add Vercel static output config`（本地，尚未 push）
- 新增 `vercel.json`：

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false
}
```

- 站点是纯静态：文件都在 `dist/`，**没有 build 命令**。

## 二、Vercel 控制台设置（如果继续用现有项目）

| 设置 | 值 |
|---|---|
| Project Name | `pet2stitch` |
| Root Directory | `./` |
| Application Preset | `Other` |
| Build Command | 留空（Override 后清空） |
| Output Directory | `dist`（Override 打开后填） |
| Install Command | 留空 |
| Environment Variables | 暂时不填 |

## 三、命令行部署（推荐）

```bash
cd ~/projects/threadform-mvp

# 1. 确认登录的是正确账号
vercel whoami          # 应显示 rayvin19901110-4623

# 2. 关联/创建项目（第一次会问 scope，选 lawrence-rayvins-projects）
vercel link --yes --project pet2stitch

# 3. 生产部署
vercel --prod --yes

# 4. 记下输出里的 https://pet2stitch-*.vercel.app 地址，先验证
curl -I https://<部署地址>
```

打开部署地址检查：

- 首屏标题、上传按钮、示例按钮正常
- 上传一张猫/狗照片能出预览
- 下载 PDF 正常
- 手机 390×844 无横向溢出

## 四、绑定域名（需要先买/已有域名）

**不要在没有明确同意的情况下买域名。** 如果 `pet2stitch.com` 已购买：

```bash
vercel domains add pet2stitch.com pet2stitch
vercel domains inspect pet2stitch.com
```

然后按 Vercel 提示在域名商处配置 DNS（通常 `A 76.76.21.21` 或 `CNAME cname.vercel-dns.com`）。

## 五、GSC / GA4（需要你的 Google 账号）

这两步必须你本人登录，我不能代做：

1. **Google Search Console**：添加 `pet2stitch.com` 资源 → 用 DNS TXT 或 HTML 文件验证 → 提交 `sitemap.xml`（如果没有 sitemap，先加一个静态 `dist/sitemap.xml`）。
2. **GA4**：创建媒体资源 → 拿到 `G-XXXXXXX` → 在 `dist/index.html` 的 `<head>` 加 gtag 片段，或在 Vercel 用环境变量注入。
3. 验证：打开站点，用 GA4 实时报告看是否收到 page_view；GSC 用“网址检查”请求编入索引。

## 六、网络问题（2026-11-14 实测）

```
curl https://api.vercel.com/v2/user  -> 000（5s 超时）
curl https://github.com             -> 000
curl https://www.google.com         -> 000
curl https://www.cloudflare.com     -> 000
nslookup api.vercel.com             -> 198.18.0.104（假 IP 段）
系统 DNS                            -> 114.114.114.114
```

判断：本机代理/分流工具（Clash/Surge 之类）可能没在运行，或 DNS 被设成了 fake-ip 但代理没接管；**不是 Vercel 账号问题**。恢复代理后重试即可。`vercel whoami` 能返回用户名，是因为它用了本地凭据/缓存，真正调 API 仍然失败。

## 七、GitHub push（网络恢复后）

当前 `gh auth status` 显示 token 无效：

```bash
gh auth refresh -h github.com     # 需要浏览器授权
cd ~/projects/threadform-mvp
git push origin main
```

如果不想用 gh，也可以直接用仓库里已配置的 git 凭据 push；失败再刷新授权。

## 八、完成标准

- [ ] `https://pet2stitch.vercel.app`（或自定义域）能打开
- [ ] 上传照片 → 预览 → 下载 PDF 全流程可用
- [ ] 手机端无横向溢出
- [ ] GSC 已验证并提交 sitemap
- [ ] GA4 实时报告收到 page_view
- [ ] 域名已绑定且 HTTPS 正常
