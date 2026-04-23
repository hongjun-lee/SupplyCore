#!/bin/bash
# 安装 mermaid-cli 用于高质量渲染 Mermaid 图表

echo "📦 安装 mermaid-cli..."

# 检查是否已安装 Node.js
if ! command -v node &> /dev/null; then
    echo "❌ 未找到 Node.js"
    echo "   请先安装 Node.js: https://nodejs.org/"
    exit 1
fi

# 检查是否已安装 npm
if ! command -v npm &> /dev/null; then
    echo "❌ 未找到 npm"
    exit 1
fi

echo "✅ Node.js 版本: $(node --version)"
echo "✅ npm 版本: $(npm --version)"

# 安装 mermaid-cli
echo ""
echo "正在安装 @mermaid-js/mermaid-cli..."
npm install -g @mermaid-js/mermaid-cli

# 验证安装
if command -v mmdc &> /dev/null; then
    echo ""
    echo "✅ 安装成功！"
    echo "   mermaid-cli 版本: $(mmdc --version)"
    echo ""
    echo "现在可以生成高质量的 Mermaid 图表了！"
else
    echo ""
    echo "❌ 安装失败，请检查错误信息"
    exit 1
fi
