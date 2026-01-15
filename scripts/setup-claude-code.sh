#!/bin/bash

###############################################################################
# Claude Code セットアップスクリプト
#
# このスクリプトはDev Container内でClaude Codeの環境を最適化します
###############################################################################

set -e

echo "🚀 Claude Code環境のセットアップを開始します..."
echo ""

# カラー定義
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 1. システム情報の確認
echo "📊 システム情報を確認しています..."
echo "  - Node.js: $(node --version)"
echo "  - npm: $(npm --version)"
echo "  - Git: $(git --version)"
echo ""

# 2. Claude Codeのインストール確認
echo "🔍 Claude Codeのインストール状態を確認しています..."
if command -v claude &> /dev/null; then
    CLAUDE_VERSION=$(claude --version 2>&1 || echo "不明")
    echo -e "${GREEN}✓${NC} Claude Code がインストールされています: $CLAUDE_VERSION"
else
    echo -e "${YELLOW}!${NC} Claude Code がインストールされていません"
    echo "  インストールを開始します..."
    sudo npm install -g @anthropic-ai/claude-code@latest
    echo -e "${GREEN}✓${NC} Claude Code のインストールが完了しました"
fi
echo ""

# 3. Git設定の確認
echo "🔍 Git設定を確認しています..."
GIT_NAME=$(git config --global user.name || echo "")
GIT_EMAIL=$(git config --global user.email || echo "")

if [ -z "$GIT_NAME" ] || [ -z "$GIT_EMAIL" ]; then
    echo -e "${YELLOW}!${NC} Git設定が不完全です"
    echo ""
    read -p "Git ユーザー名を入力してください: " INPUT_NAME
    read -p "Git メールアドレスを入力してください: " INPUT_EMAIL

    git config --global user.name "$INPUT_NAME"
    git config --global user.email "$INPUT_EMAIL"
    echo -e "${GREEN}✓${NC} Git設定が完了しました"
else
    echo -e "${GREEN}✓${NC} Git設定済み: $GIT_NAME <$GIT_EMAIL>"
fi
echo ""

# 4. ファイル権限の確認と修正
echo "🔐 ファイル権限を確認しています..."
if [ -w . ]; then
    echo -e "${GREEN}✓${NC} 書き込み権限があります"
else
    echo -e "${YELLOW}!${NC} 書き込み権限がありません。修正します..."
    sudo chown -R vscode:vscode . || true
    echo -e "${GREEN}✓${NC} 権限を修正しました"
fi
echo ""

# 5. Claude設定ディレクトリの確認
echo "📁 Claude設定ディレクトリを確認しています..."
CLAUDE_DIR="$HOME/.claude"
if [ -d "$CLAUDE_DIR" ]; then
    echo -e "${GREEN}✓${NC} Claude設定ディレクトリが存在します: $CLAUDE_DIR"

    # 権限の確認
    if [ -w "$CLAUDE_DIR" ]; then
        echo -e "${GREEN}✓${NC} 設定ディレクトリに書き込み権限があります"
    else
        echo -e "${YELLOW}!${NC} 設定ディレクトリの権限を修正します..."
        chmod 700 "$CLAUDE_DIR"
        echo -e "${GREEN}✓${NC} 権限を修正しました"
    fi
else
    echo -e "${YELLOW}!${NC} Claude設定ディレクトリが見つかりません"
    echo "  ホスト側で以下のコマンドを実行してください:"
    echo "    mkdir -p ~/.claude && chmod 700 ~/.claude"
fi
echo ""

# 6. Node.js依存関係の確認
echo "📦 Node.js依存関係を確認しています..."
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} node_modulesが存在します"
else
    echo -e "${YELLOW}!${NC} node_modulesが見つかりません"
    echo "  npm installを実行します..."
    npm install
    echo -e "${GREEN}✓${NC} 依存関係のインストールが完了しました"
fi
echo ""

# 7. 推奨設定ファイルの確認
echo "⚙️  推奨設定ファイルを確認しています..."

RECOMMENDED_FILES=(
    ".devcontainer/devcontainer.json.recommended"
    "Dockerfile.recommended"
    ".vscode/tasks.json"
    ".vscode/launch.json"
    "docs/CLAUDE_CODE_CONTAINER_BEST_PRACTICES.md"
    "docs/CLAUDE_CODE_QUICK_START.md"
)

ALL_EXISTS=true
for file in "${RECOMMENDED_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓${NC} $file"
    else
        echo -e "${RED}✗${NC} $file (見つかりません)"
        ALL_EXISTS=false
    fi
done
echo ""

# 8. 環境変数の確認
echo "🌍 環境変数を確認しています..."
echo "  - NODE_ENV: ${NODE_ENV:-未設定}"
echo "  - FORCE_COLOR: ${FORCE_COLOR:-未設定}"
echo ""

# 9. ポートの確認
echo "🔌 ポート3000の使用状態を確認しています..."
if lsof -i:3000 &> /dev/null; then
    echo -e "${YELLOW}!${NC} ポート3000は既に使用されています"
else
    echo -e "${GREEN}✓${NC} ポート3000は使用可能です"
fi
echo ""

# 10. セットアップ完了
echo "════════════════════════════════════════════════════════════════"
echo -e "${GREEN}✅ セットアップが完了しました！${NC}"
echo "════════════════════════════════════════════════════════════════"
echo ""
echo "次のステップ:"
echo "  1. Claude Code を起動: claude"
echo "  2. 開発サーバーを起動: npm run dev"
echo "  3. クイックスタートガイドを確認: cat docs/CLAUDE_CODE_QUICK_START.md"
echo ""
echo "VS Codeタスクも利用可能です（Cmd/Ctrl + Shift + P → Tasks: Run Task）"
echo ""

# オプション: Claude Codeの起動を提案
echo -e "${YELLOW}今すぐClaude Codeを起動しますか？ (y/n)${NC}"
read -r response
if [[ "$response" =~ ^([yY][eE][sS]|[yY])$ ]]; then
    echo ""
    echo "Claude Codeを起動します..."
    claude
fi
