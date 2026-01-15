# コンテナ内でClaude Codeを使用するためのベストプラクティス

## 目次
1. [現在の設定の分析](#現在の設定の分析)
2. [セキュリティのベストプラクティス](#セキュリティのベストプラクティス)
3. [パフォーマンス最適化](#パフォーマンス最適化)
4. [開発ワークフロー](#開発ワークフロー)
5. [トラブルシューティング](#トラブルシューティング)
6. [推奨される追加設定](#推奨される追加設定)

---

## 現在の設定の分析

### 現在実装されている良い点 ✅

#### 1. Claude設定の永続化
```json
"mounts": [
  "source=${localEnv:HOME}${localEnv:USERPROFILE}/.claude,target=/home/vscode/.claude,type=bind,consistency=cached"
]
```
- **メリット**: APIキーや設定がコンテナ再起動後も保持される
- **重要性**: 毎回APIキーを入力する手間を省く

#### 2. 自動インストール
```json
"postCreateCommand": "sudo chown -R vscode:vscode . || true && npm install && sudo npm install -g @anthropic-ai/claude-code@1.0.37"
```
- **メリット**: コンテナ作成時に自動的にClaude Codeがインストールされる
- **注意点**: バージョン固定により再現性が保証される

#### 3. 適切なユーザー権限
```json
"remoteUser": "vscode"
```
- **セキュリティ**: rootユーザーではなく、専用ユーザーで実行

---

## セキュリティのベストプラクティス

### 1. APIキーの管理

#### ✅ 推奨される方法
```bash
# ホスト側で.claudeディレクトリに設定を保存
# コンテナにマウントすることで共有（現在の設定）
```

#### ❌ 避けるべき方法
- Dockerfileに直接APIキーを記述
- 環境変数を.devcontainer.jsonに平文で記載
- Gitリポジトリに認証情報をコミット

### 2. .gitignoreの確認

以下のファイルが必ず除外されていることを確認：
```gitignore
# Claude Code設定（ローカルにのみ保持）
.claude/

# 環境変数
.env
.env.local
.env.*.local

# VS Code設定（個人設定を除く）
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
```

### 3. 最小権限の原則

```json
// sudoの使用を必要最小限に
"postCreateCommand": "npm install",
// 必要な場合のみsudoを使用
"postCreateCommand": "sudo chown -R vscode:vscode . || true && npm install"
```

---

## パフォーマンス最適化

### 1. マウントの最適化

#### 現在の設定
```json
"mounts": [
  "source=${localEnv:HOME}${localEnv:USERPROFILE}/.claude,target=/home/vscode/.claude,type=bind,consistency=cached"
]
```

#### さらなる最適化案
```json
"mounts": [
  // Claude設定（読み書きが多い）
  "source=${localEnv:HOME}${localEnv:USERPROFILE}/.claude,target=/home/vscode/.claude,type=bind,consistency=cached",

  // SSH設定の共有（Gitプッシュ時に便利）
  "source=${localEnv:HOME}${localEnv:USERPROFILE}/.ssh,target=/home/vscode/.ssh-localhost,type=bind,consistency=cached,readonly",

  // Git設定の共有
  "source=${localEnv:HOME}${localEnv:USERPROFILE}/.gitconfig,target=/home/vscode/.gitconfig,type=bind,consistency=cached,readonly"
]
```

**注意**: SSH秘密鍵を共有する場合は、readonlyマウントを使用し、コンテナ内でコピーして使用することを推奨

### 2. Node.jsの依存関係キャッシュ

#### Named Volumeの活用
```json
"mounts": [
  "source=amaejozu-node-modules,target=${containerWorkspaceFolder}/node_modules,type=volume"
]
```

**メリット**:
- `npm install`の実行時間を大幅に短縮
- ホストOSとの互換性問題を回避（特にWindowsで有効）

### 3. Claude Codeバージョンの柔軟な管理

```json
// 固定バージョン（現在）
"postCreateCommand": "sudo npm install -g @anthropic-ai/claude-code@1.0.37"

// 最新版を使用（推奨される場合）
"postCreateCommand": "sudo npm install -g @anthropic-ai/claude-code@latest"

// または、package.jsonで管理
"postCreateCommand": "sudo npm install -g @anthropic-ai/claude-code"
```

---

## 開発ワークフロー

### 1. Claude Code起動方法

#### コンテナ内から直接起動
```bash
# VS Code統合ターミナルで実行
claude

# または特定のプロンプトで起動
claude "Next.jsのページコンポーネントを作成して"
```

#### VS Codeタスクとして登録（推奨）

`.vscode/tasks.json`を作成:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Launch Claude Code",
      "type": "shell",
      "command": "claude",
      "problemMatcher": [],
      "presentation": {
        "reveal": "always",
        "panel": "new"
      }
    }
  ]
}
```

### 2. Gitワークフローとの統合

Claude Codeはgit操作も実行できるため、以下を確認：

```bash
# コンテナ内でGit設定を確認
git config --global user.name
git config --global user.email

# 未設定の場合は設定
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. 効率的なファイル編集

Claude Codeが編集するファイルに対して、VS Code設定を最適化：

```json
// .vscode/settings.json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.watcherExclude": {
    "**/node_modules/**": true,
    "**/.git/objects/**": true,
    "**/.git/subtree-cache/**": true,
    "**/dist/**": true,
    "**/.next/**": true
  }
}
```

---

## トラブルシューティング

### 問題1: Claude Codeが起動しない

#### 診断手順
```bash
# 1. インストール確認
which claude
claude --version

# 2. 権限確認
ls -la $(which claude)

# 3. Node.js環境確認
node --version
npm --version
```

#### 解決策
```bash
# 再インストール
sudo npm uninstall -g @anthropic-ai/claude-code
sudo npm install -g @anthropic-ai/claude-code@latest

# またはコンテナを再ビルド
# VS Code: Cmd/Ctrl + Shift + P -> "Dev Containers: Rebuild Container"
```

### 問題2: APIキーが保存されない

#### 確認事項
```bash
# マウント確認
mount | grep claude

# ディレクトリの権限確認
ls -la ~/.claude/
```

#### 解決策
```bash
# ホスト側でディレクトリを作成
mkdir -p ~/.claude
chmod 700 ~/.claude

# コンテナを再起動
```

### 問題3: ファイル権限エラー

#### 現在の設定で対処済み
```json
"postCreateCommand": "sudo chown -R vscode:vscode . || true && ..."
```

#### 追加の対処
```bash
# コンテナ内で実行
sudo chown -R vscode:vscode /workspace
sudo chmod -R u+w /workspace
```

### 問題4: パフォーマンスが遅い

#### Windowsの場合
WSL2を使用することを強く推奨：
```powershell
# WSL2の確認
wsl --list --verbose

# WSL2に変換（必要な場合）
wsl --set-version Ubuntu 2
```

プロジェクトをWSL2内に配置：
```bash
\\wsl$\Ubuntu\home\username\projects\
```

#### macOSの場合
`.devcontainer/devcontainer.json`でキャッシュ設定を最適化：
```json
"mounts": [
  "source=${localEnv:HOME}/.claude,target=/home/vscode/.claude,type=bind,consistency=delegated"
]
```

---

## 推奨される追加設定

### 1. 環境変数の管理

`.devcontainer/devcontainer.json`に追加：
```json
"containerEnv": {
  "NODE_ENV": "development",
  "FORCE_COLOR": "1"
},
"remoteEnv": {
  "PATH": "${containerEnv:PATH}:/home/vscode/.local/bin"
}
```

### 2. 開発体験の向上

```json
"customizations": {
  "vscode": {
    "extensions": [
      // 既存の拡張機能...
      "github.copilot",  // Claude Codeと併用可能
      "eamodio.gitlens",
      "ms-vscode.vscode-typescript-next"
    ],
    "settings": {
      "terminal.integrated.defaultProfile.linux": "zsh",
      "terminal.integrated.profiles.linux": {
        "zsh": {
          "path": "/bin/zsh",
          "args": ["-l"]
        }
      },
      // Claude Codeとの相性設定
      "editor.quickSuggestions": {
        "other": true,
        "comments": false,
        "strings": true
      }
    }
  }
}
```

### 3. デバッグ設定

`.vscode/launch.json`の例：
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

### 4. マルチステージDockerfile（本番用）

開発用と本番用を分離：
```dockerfile
# Dockerfile.dev（開発用 - 現在のDockerfile）
FROM node:22-slim
RUN apt-get update && apt-get install -y git curl
EXPOSE 3000

# Dockerfile.prod（本番用）
FROM node:22-slim AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:22-slim AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

### 5. Docker Composeとの統合（バックエンドとの連携用）

`docker-compose.yml`の例：
```yaml
version: '3.8'

services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    volumes:
      - .:/workspace:cached
      - node_modules:/workspace/node_modules
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=development
    depends_on:
      - backend
      - mysql

  backend:
    # バックエンドの設定...

  mysql:
    # MySQLの設定...

volumes:
  node_modules:
```

---

## まとめ：推奨される設定チェックリスト

### 必須項目
- [x] Claude Code設定ディレクトリのマウント
- [x] 適切なユーザー権限（非root）
- [x] Git設定の共有
- [x] .gitignoreでAPIキーを除外

### 推奨項目
- [ ] Named volumeでnode_modulesを管理
- [ ] VS Codeタスクの設定
- [ ] デバッグ設定の追加
- [ ] パフォーマンス監視

### オプション項目
- [ ] SSH設定の共有（Gitプッシュ用）
- [ ] Docker Composeとの統合
- [ ] マルチステージビルド（本番用）
- [ ] CI/CD統合

---

## 参考リンク

- [Claude Code公式ドキュメント](https://github.com/anthropics/claude-code)
- [VS Code Dev Containers](https://code.visualstudio.com/docs/devcontainers/containers)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Next.js Deployment](https://nextjs.org/docs/deployment)

---

## バージョン情報

- Claude Code: 1.0.37
- Node.js: 22-slim
- Dev Container仕様: 最新

最終更新: 2026-01-15
