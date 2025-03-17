# YouTube Subtitle Helper

这是一个 Chrome 扩展，用于为 YouTube 视频添加自定义字幕功能。

## 功能特点

- 支持在 YouTube 视频上显示自定义字幕
- 支持多语言切换（英文、中文、日语）
- 字幕显示位置可调整
- 简单易用的用户界面

## 安装说明

1. 克隆或下载此仓库到本地
2. 打开 Chrome 浏览器，进入扩展管理页面（chrome://extensions/）
3. 开启右上角的"开发者模式"
4. 点击"加载已解压的扩展程序"
5. 选择本项目的根目录

## 使用方法

1. 安装扩展后，在 YouTube 视频页面上会出现一个扩展图标
2. 点击图标打开控制面板
3. 使用控制面板中的按钮开启/关闭字幕
4. 使用下拉菜单选择字幕语言

## 项目结构

```
youtube-translation/
├── manifest.json     # Chrome 扩展配置文件
├── popup.html       # 扩展弹出窗口界面
├── popup.js         # 弹出窗口交互逻辑
├── content.js       # 注入到 YouTube 页面的主要功能代码
├── styles.css       # 样式文件
├── icons/           # 扩展图标
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
└── README.md        # 项目说明文档
```

## 开发计划

- [ ] 添加字幕上传功能
- [ ] 支持更多语言
- [ ] 添加字幕样式自定义
- [ ] 支持字幕时间轴调整

## 贡献指南

欢迎提交 Pull Request 或创建 Issue 来帮助改进这个项目。

## 许可证

MIT License