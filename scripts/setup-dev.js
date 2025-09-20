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
  const cargoBin = path.join(process.env.HOME || process.env.USERPROFILE, '.cargo', 'bin');
  if (!checkIfExists(path.join(cargoBin, 'rustc.exe')) && !checkIfExists(path.join(cargoBin, 'rustc'))) {
    console.log('ⓘ 建议安装 Rust 以支持桌面应用开发');
  } else {
    console.log('✓ Rust 已安装');
  }

  // 尝试不同的安装方法
  console.log('\n尝试安装依赖...');

  // 方法1: 使用自定义缓存目录
  if (!runCommand('npm install --cache .npm-cache', '使用自定义缓存目录安装依赖')) {
    console.log('ⓘ 尝试方法2: 清理缓存后安装');

    // 方法2: 清理缓存后安装
    try {
      execSync('npm cache clean --force', { stdio: 'ignore' });
      console.log('✓ npm缓存已清理');
    } catch (error) {
      console.log('ⓘ 无法清理npm缓存，跳过此步骤');
    }

    if (!runCommand('npm install', '安装npm依赖')) {
      console.log('ⓘ 尝试方法3: 使用yarn安装依赖（如果已安装yarn）');

      // 方法3: 使用yarn
      try {
        execSync('yarn --version', { stdio: 'ignore' });
        if (!runCommand('yarn install', '使用yarn安装依赖')) {
          console.log('✗ 所有安装方法都失败了');
          console.log('\n建议:');
          console.log('1. 以管理员身份运行命令提示符');
          console.log('2. 或手动安装依赖:');
          console.log('   - npm install @tauri-apps/api@^1.5.0');
          console.log('   - npm install @tauri-apps/cli@^1.5.0');
          console.log('   - npm install typescript@^5.0.0');
          console.log('   - npm install vite@^5.0.0');
          console.log('   - npm install jest@^29.0.0');
          console.log('   - npm install @testing-library/jest-dom@^6.0.0');
          process.exit(1);
        }
      } catch (error) {
        console.log('✗ yarn未安装，无法使用yarn安装依赖');
        console.log('\n建议:');
        console.log('1. 以管理员身份运行命令提示符');
        console.log('2. 或手动安装依赖:');
        console.log('   - npm install @tauri-apps/api@^1.5.0');
        console.log('   - npm install @tauri-apps/cli@^1.5.0');
        console.log('   - npm install typescript@^5.0.0');
        console.log('   - npm install vite@^5.0.0');
        console.log('   - npm install jest@^29.0.0');
        console.log('   - npm install @testing-library/jest-dom@^6.0.0');
        process.exit(1);
      }
    }
  }

  console.log('\n✓ 开发环境设置完成');
  console.log('\n接下来的步骤:');
  console.log('1. 运行 "npm run dev" 启动开发服务器');
  console.log('2. 运行 "npm test" 执行测试');
  console.log('3. 运行 "npm run lint" 检查代码质量');
}

main();