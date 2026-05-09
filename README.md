# 开浪设计 KAILANG DESIGN — 作品展示网站

极简风格的静态作品集网站，无需框架依赖，可直接部署。

## 目录结构

```
├── index.html          主页面
├── style.css           样式
├── script.js           交互逻辑
├── config.js           ← 图片配置文件（更新作品在这里改）
├── images/
│   ├── svg-tweets/     SVG推文
│   ├── product-posters/产品海报
│   ├── brand-kv/       品牌KV
│   └── peripherals/    周边&线下物料
└── README.md
```

## 如何更新作品图片

### 1. 放入图片

将作品图片文件（.jpg / .png / .webp / .svg）放入对应的 `images/` 子文件夹。

### 2. 编辑 config.js

打开 `config.js`，在对应分类的数组中列出文件名：

```js
const portfolio = {
  "svg-tweets": ["my-work-1.jpg", "my-work-2.png"],
  "product-posters": ["poster-a.jpg", "poster-b.jpg"],
  "brand-kv": ["kv-spring.jpg"],
  "peripherals": ["tote-bag.jpg", "business-card.jpg"]
};
```

保存即可，刷新页面就能看到更新。

### 3. 长图自动滚动

如果图片是长图（高度明显大于宽度，比如手机端推文长图），网站会自动检测并添加悬停滚动效果——鼠标悬停时图片会缓慢向上滚动，展示完整内容。

## 部署

这是纯静态网站，可以部署到：

- **GitHub Pages** — 推送到仓库，开启 Pages 即可
- **Vercel / Netlify** — 拖入文件夹一键部署
- **任何静态服务器** — 直接上传所有文件

## 自定义

- **配色**：编辑 `style.css` 顶部 `:root` 变量
- **联系方式**：编辑 `index.html` 中 header 的微信号
- **标语**：编辑 `index.html` 中的 tagline 文字
- **列数**：修改 `style.css` 中 `.grid` 的 `grid-template-columns`

## 技术特性

- 纯 HTML + CSS + JS，无框架依赖
- 响应式布局：桌面4列 / 平板2列 / 手机1列
- 滚动渐入动画（Intersection Observer）
- 长图悬停自动滚动
- 图片懒加载
- 固定导航栏 + 毛玻璃效果
