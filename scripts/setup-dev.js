#!/usr/bin/env node

// scripts/setup-dev.js - 开发环境设置脚本

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runCommand(command, description) {
  console.log(`正在 ${description}...`);
  try {
    const output = execSync(command, { encoding: 'utf8', stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`✗ ${description} 失败:`, error.message);
    return false;
  }
}

function checkIfExists(filePath) {
  return fs.existsSync(filePath);
}

function main() {
  console.log('设置开发环境...\n');

  // 检查Node.js和npm
  if (!checkIfExists(process.execPath)) {
    console.log('✗ 请先安装 Node.js (v16+)');
    process.exit(1);
  }

  console.log(`✓ Node.js 已安装: ${process.version}`);

  // 检查Rust
  if (!checkIfExists(path.join(process.env.HOME || process.env.USERPROFILE, '.cargo', 'bin', 'rustc'))) {
    console.log('ⓘ 建议安装 Rust 以支持桌面应用开发');
  } else {
    console.log('✓ Rust 已安装');
  }

  // 安装npm依赖
  if (!runCommand('npm install', '安装npm依赖')) {
    console.log('✗ npm依赖安装失败');
    process.exit(1);
  }

  console.log('\n✓ 开发环境设置完成');
  console.log('\n接下来的步骤:');
  console.log('1. 运行 "npm run dev" 启动开发服务器');
  console.log('2. 运行 "npm test" 执行测试');
  console.log('3. 运行 "npm run lint" 检查代码质量');
}

main();