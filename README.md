# 梦幻星空 - 动态前端网站

这是一个简单但美丽的前端网站，具有多种动画效果和响应式设计。该项目专为Neocities部署而设计。

## 项目特点

- 星空背景动画效果
- 背景音乐播放功能
- 视频和图片媒体展示
- 响应式设计，适配各种设备
- 丰富的CSS动画和过渡效果
- 滚动触发动画
- 简洁现代的UI设计

## 文件结构说明

本网站采用分类文件夹结构组织资源文件，确保文件组织清晰：

```
项目根目录/
├── index.html        # 主页面
├── style.css         # 样式表
├── script.js         # JavaScript脚本
├── ass/              # 图片和视频资源文件夹
│   ├── stars.png     # 星空背景
│   ├── twinkling.png # 闪烁星光背景
│   ├── clouds.png    # 云层背景
│   ├── moon.jpg      # 月球图片
│   ├── sky.jpg       # 星空图片
│   ├── galaxy1.jpg   # 星空特写
│   ├── galaxy2.jpg   # 星云图片
│   ├── galaxy3.jpg   # 宇宙景观
│   └── space.mp4     # 太空视频
└── music/            # 音频资源文件夹
    ├── cover.jpg     # 音乐封面图片
    └── music.mp3     # 背景音乐文件
```

## 部署指南

### 1. 本地部署与测试

1. **保持文件夹结构**
   - 确保保持上述文件夹结构不变
   - 按照文件夹分类存放相应的资源文件

2. **文件命名要求**
   - 所有文件名必须与代码中引用的完全一致，包括大小写
   - 例如：`ass/galaxy1.jpg`、`music/cover.jpg`等

3. **本地测试**
   - 使用Live Server或类似工具启动本地服务器
   - 通过浏览器访问并检查是否有404错误

### 2. Neocities部署

在Neocities上部署时，需要保持相同的文件夹结构：

1. **创建文件夹**
   - 在Neocities网站根目录创建`ass`和`music`文件夹

2. **上传文件**
   - 将`index.html`、`style.css`和`script.js`上传到根目录
   - 将所有图片和视频上传到`ass`文件夹
   - 将音乐和封面图片上传到`music`文件夹

3. **检查路径**
   - 确保HTML和CSS中的所有路径都正确指向相应的文件夹
   - 例如：`src="ass/galaxy1.jpg"`而不是`src="galaxy1.jpg"`

## 文件准备清单

### ass文件夹内容

| 文件名 | 用途 | 原始文件名 |
|-------|------|-----------|
| stars.png | 星空背景 | 无需更改 |
| twinkling.png | 闪烁星光背景 | 无需更改 |
| clouds.png | 云层背景 | 无需更改 |
| moon.jpg | 月球图片 | 无需更改 |
| sky.jpg | 星空图片 | 无需更改 |
| galaxy1.jpg | 星空特写 | 原微信图片_20250301154151_22.jpg |
| galaxy2.jpg | 星云图片 | 原微信图片_20250301154142_20.jpg |
| galaxy3.jpg | 宇宙景观 | 原微信图片_20250301154138_19.jpg |
| space.mp4 | 太空视频 | 无需更改 |

### music文件夹内容

| 文件名 | 用途 |
|-------|------|
| cover.jpg | 音乐封面图片 |
| music.mp3 | 背景音乐文件 |

## 排查资源文件问题

如果在部署后遇到404错误或资源无法加载：

1. **检查文件夹结构**
   - 确认`ass`和`music`文件夹存在且名称正确
   - 确认各文件放在正确的文件夹中

2. **检查文件引用路径**
   - HTML中的图片、视频路径应为`ass/filename.jpg`
   - 音乐和封面应为`music/filename.mp3`
   - CSS中的背景图片路径应为`ass/filename.png`

3. **检查文件名大小写**
   - 确保文件名的大小写与代码中引用的完全一致
   - 例如：如果代码中是`ass/Galaxy1.jpg`，文件名也必须是`Galaxy1.jpg`而非`galaxy1.jpg`

4. **检查文件权限**
   - 确保上传的文件具有适当的读取权限

## 性能优化建议

- **压缩大型图片**：`ass/sky.jpg`文件较大(21MB)，可以压缩以提高加载速度
- **预加载背景图片**：考虑在CSS中添加预加载指令以提高第一次访问的体验
- **延迟加载画廊图片**：可以实现延迟加载技术以优化大量图片的加载性能

## 资源链接

- [Neocities帮助文档](https://neocities.org/help)
- [HTML基础教程](https://developer.mozilla.org/zh-CN/docs/Learn/HTML/Introduction_to_HTML)
- [CSS基础教程](https://developer.mozilla.org/zh-CN/docs/Learn/CSS/First_steps)
- [如何诊断404错误](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Status/404)

## 许可证

此项目采用MIT许可证 - 详细信息请查看LICENSE文件。 