#!/usr/bin/env node

// scripts/check-env.js - 开发环境检查脚本

const { execSync } = require('child_process');

function checkCommand(command, name) {
  try {
    const version = execSync(`${command} --version`, { encoding: 'utf8' });
    console.log(`✓ ${name} 已安装: ${version.trim()}`);
    return true;
  } catch (error) {
    console.log(`✗ ${name} 未安装`);
    return false;
  }
}

function checkNodeVersion() {
  try {
    const version = process.version;
    const majorVersion = parseInt(version.slice(1).split('.')[0]);

    if (majorVersion >= 16) {
      console.log(`✓ Node.js 版本满足要求: ${version}`);
      return true;
    } else {
      console.log(`✗ Node.js 版本过低: ${version} (需要 v16+)`);
      return false;
    }
  } catch (error) {
    console.log('✗ 无法检测 Node.js 版本');
    return false;
  }
}

function main() {
  console.log('检查开发环境...\n');

  const checks = [
    checkNodeVersion(),
    checkCommand('npm', 'npm'),
    checkCommand('rustc', 'Rust'),
    checkCommand('cargo', 'Cargo'),
  ];

  // 检查Tauri CLI
  try {
    const version = execSync('cargo tauri --version', { encoding: 'utf8' });
    console.log(`✓ Tauri CLI 已安装: ${version.trim()}`);
    checks.push(true);
  } catch (error) {
    console.log('ⓘ Tauri CLI 未安装 (可选，用于桌面应用开发)');
    checks.push(true); // 这是可选的，所以不标记为失败
  }

  console.log('\n--- 检查结果 ---');

  const allPassed = checks.every(check => check);

  if (allPassed) {
    console.log('✓ 所有必需的开发环境已正确配置');
  } else {
    console.log('✗ 一些必需的开发环境缺失，请安装后再继续');
    process.exit(1);
  }
}

main();