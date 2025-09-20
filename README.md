# ecom-product-photo-tool

AI驱动的桌面工具，用于电子商务产品图像生成。

## 功能特点

- 集成图像到图像AI模型
- 预设计模板系统
- 自然语言命令优化
- 多格式导出支持

## 技术栈

- 桌面框架: Tauri
- 前端: React + TypeScript
- 后端: Rust
- AI模型: Doubao-Seedream-4.0, nano banana, deepseek

## 开发环境

### 先决条件

- Node.js (v16+)
- Rust (最新稳定版)
- Tauri CLI

### 安装

```bash
npm install
```

### 开发

```bash
npm run dev
```

### 构建

```bash
npm run build
```

### 测试

```bash
# 运行测试
npm test

# 运行测试并监视更改
npm run test:watch

# 运行测试并生成覆盖率报告
npm run test:coverage
```

### 代码质量

```bash
# 运行ESLint检查
npm run lint

# 运行ESLint并自动修复问题
npm run lint:fix

# 运行Prettier格式化代码
npm run format
```

## 项目结构

```
.
├── src/                 # 前端源代码
│   ├── assets/          # 静态资源
│   ├── components/      # UI组件
│   ├── pages/           # 页面组件
│   ├── styles/          # 样式文件
│   ├── utils/           # 工具函数
│   ├── types/           # TypeScript类型定义
│   ├── main.ts          # 应用入口点
│   └── index.html       # HTML模板
├── src-tauri/           # Tauri后端代码
│   ├── src/             # Rust源代码
│   ├── Cargo.toml       # Rust包配置
│   └── tauri.conf.json  # Tauri配置
├── dist/                # 构建输出目录
├── node_modules/        # npm依赖包
├── package.json         # npm包配置
├── tsconfig.json        # TypeScript配置
├── vite.config.ts       # Vite配置
├── .eslintrc.json       # ESLint配置
├── .prettierrc          # Prettier配置
├── .gitignore           # Git忽略文件
└── README.md            # 项目说明文档
```