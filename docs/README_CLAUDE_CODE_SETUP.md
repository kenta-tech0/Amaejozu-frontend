# Claude Code コンテナ環境セットアップ - 概要

このドキュメントでは、コンテナ内でClaude Codeを最適に使用するためのベストプラクティスと設定ファイルについて説明します。

## 📦 作成されたファイル一覧

### 1. ドキュメント

| ファイル | 説明 |
|---------|------|
| `docs/CLAUDE_CODE_CONTAINER_BEST_PRACTICES.md` | 完全版ベストプラクティスガイド（セキュリティ、パフォーマンス、トラブルシューティング等） |
| `docs/CLAUDE_CODE_QUICK_START.md` | 5分で始められるクイックスタートガイド |
| `docs/README_CLAUDE_CODE_SETUP.md` | このファイル（セットアップの概要） |

### 2. 設定ファイル（推奨版）

| ファイル | 説明 | 既存ファイル |
|---------|------|------------|
| `.devcontainer/devcontainer.json.recommended` | 最適化されたDev Container設定 | `.devcontainer/devcontainer.json` |
| `Dockerfile.recommended` | 改善されたDockerfile | `Dockerfile` |

### 3. VS Code設定

| ファイル | 説明 |
|---------|------|
| `.vscode/tasks.json` | Claude Code起動などの便利なタスク定義 |
| `.vscode/launch.json` | Next.jsのデバッグ設定 |

### 4. ユーティリティスクリプト

| ファイル | 説明 |
|---------|------|
| `scripts/setup-claude-code.sh` | 環境セットアップ自動化スクリプト |

---

## 🚀 クイックスタート

### 現在の環境で今すぐ使い始める

現在の設定でも既にClaude Codeは使用可能です：

```bash
# Claude Codeを起動
claude
```

### 推奨設定を適用する（オプション）

より最適化された環境を構築したい場合：

#### 方法1: 自動セットアップスクリプト使用（推奨）

```bash
# Dev Container内で実行
./scripts/setup-claude-code.sh
```

このスクリプトは以下を自動で実行します：
- システム情報の確認
- Claude Codeのインストール状態チェック
- Git設定の確認・設定
- ファイル権限の修正
- 依存関係のインストール

#### 方法2: 手動で設定ファイルを適用

1. **devcontainer.jsonの更新**
   ```bash
   # 推奨設定をコピー（バックアップ推奨）
   cp .devcontainer/devcontainer.json .devcontainer/devcontainer.json.backup
   cp .devcontainer/devcontainer.json.recommended .devcontainer/devcontainer.json
   ```

2. **Dockerfileの更新**
   ```bash
   # 推奨設定をコピー（バックアップ推奨）
   cp Dockerfile Dockerfile.backup
   cp Dockerfile.recommended Dockerfile
   ```

3. **コンテナの再ビルド**
   - VS Code: `Cmd/Ctrl + Shift + P` → `Dev Containers: Rebuild Container`

---

## 📚 主要なベストプラクティス（抜粋）

### 1. セキュリティ

✅ **実装済み**
- APIキーはホスト側の`~/.claude`に保存（コンテナにマウント）
- 非rootユーザー（vscode）で実行
- Git認証情報はリポジトリに含めない

✅ **推奨される追加設定**
- SSH鍵はreadonlyでマウント
- 環境変数を`.env`ファイルで管理（`.gitignore`に追加）

### 2. パフォーマンス最適化

✅ **実装済み**
- Claude設定ディレクトリを`consistency=cached`でマウント

✅ **推奨される追加設定**
- `node_modules`をnamed volumeで管理（特にWindows環境）
- Git設定ファイルの共有

### 3. 開発体験の向上

✅ **新規追加**
- VS Codeタスクでワンクリック起動
- デバッグ設定の追加
- 便利なエイリアスとショートカット

---

## 🎯 推奨設定の主な変更点

### devcontainer.json の改善点

1. **node_modulesの最適化**
   ```json
   "mounts": [
     "source=amaejozu-node-modules,target=${containerWorkspaceFolder}/node_modules,type=volume"
   ]
   ```
   → Windowsでの`npm install`速度が大幅に向上

2. **Git設定の共有**
   ```json
   "mounts": [
     "source=${localEnv:HOME}/.gitconfig,target=/home/vscode/.gitconfig,type=bind,readonly"
   ]
   ```
   → コミット時に毎回Git設定を入力する必要がなくなる

3. **VS Code拡張機能の追加**
   - GitLens: より強力なGit統合
   - TypeScript Next: 最新のTypeScript機能サポート

4. **パフォーマンス設定**
   ```json
   "files.watcherExclude": {
     "**/.next/**": true,
     "**/node_modules/**": true
   }
   ```
   → ファイル監視のオーバーヘッドを削減

### Dockerfileの改善点

1. **追加ツールのインストール**
   ```dockerfile
   RUN apt-get install -y curl ca-certificates procps
   ```
   → デバッグとヘルスチェックに有用

2. **詳細なコメント**
   → 各ステップの目的が明確に

3. **レイヤーの最適化**
   → ビルド時間とイメージサイズの削減

---

## 💡 使い方のヒント

### VS Codeタスクの活用

`Cmd/Ctrl + Shift + P` → `Tasks: Run Task` で以下が利用可能：

- **Launch Claude Code**: 新しいターミナルでClaude Codeを起動
- **Dev: Start Next.js**: 開発サーバー起動
- **Build: Next.js Production**: 本番ビルド
- **Lint: Check All Files**: ESLintでコード品質チェック
- **Fix File Permissions**: 権限問題の修正
- **Clean: Remove node_modules**: クリーンインストール
- **Check Claude Code Version**: バージョン確認

### Claude Codeの効果的な使い方

```bash
# ❌ 曖昧な指示
claude "コンポーネントを作って"

# ✅ 具体的な指示
claude "商品一覧を表示するProductListコンポーネントを作成。TypeScript + Tailwind CSSで実装し、src/components/ProductList.tsxに配置してください"
```

---

## 🔧 トラブルシューティング

### 問題: Claude Codeが起動しない

```bash
# 1. インストール確認
which claude
claude --version

# 2. 再インストール
sudo npm install -g @anthropic-ai/claude-code@latest
```

### 問題: ファイル権限エラー

```bash
# 自動修正スクリプトを実行
./scripts/setup-claude-code.sh

# または手動で修正
sudo chown -R vscode:vscode .
```

### 問題: パフォーマンスが遅い（Windows）

1. WSL2を使用していることを確認
   ```powershell
   wsl --list --verbose
   ```

2. プロジェクトをWSL2内に配置
   ```
   \\wsl$\Ubuntu\home\username\projects\
   ```

3. 推奨設定の`node_modules` volumeを適用

---

## 📊 設定の比較表

| 項目 | 現在の設定 | 推奨設定 | メリット |
|-----|----------|---------|---------|
| Claude Code | ✅ インストール済み | ✅ 最新版 | 最新機能の利用 |
| 設定の永続化 | ✅ マウント済み | ✅ 同じ | APIキー保持 |
| node_modules | ローカルマウント | Volume使用 | 高速化（特にWindows） |
| Git設定 | 手動設定必要 | 自動共有 | 設定の手間削減 |
| VS Code拡張 | 基本的なもの | 開発支援追加 | 生産性向上 |
| タスク定義 | なし | 充実 | ワンクリック実行 |
| デバッグ設定 | なし | あり | デバッグ効率化 |

---

## 🎓 学習リソース

### 初心者向け
1. [クイックスタートガイド](./CLAUDE_CODE_QUICK_START.md) - 5分で始める
2. セットアップスクリプト実行 - 自動環境構築
3. VS Codeタスクの利用 - GUI操作

### 中級者向け
1. [ベストプラクティス完全版](./CLAUDE_CODE_CONTAINER_BEST_PRACTICES.md) - 詳細な解説
2. 推奨設定ファイルの検討 - カスタマイズ
3. パフォーマンスチューニング - 最適化

### 上級者向け
1. Docker Composeとの統合 - バックエンドとの連携
2. CI/CD統合 - 自動化
3. マルチステージビルド - 本番環境対応

---

## 📞 サポート

### 質問や問題がある場合

1. **ドキュメントを確認**
   - [ベストプラクティスガイド](./CLAUDE_CODE_CONTAINER_BEST_PRACTICES.md)のトラブルシューティングセクション
   - [クイックスタートガイド](./CLAUDE_CODE_QUICK_START.md)のFAQ

2. **セットアップスクリプトを実行**
   ```bash
   ./scripts/setup-claude-code.sh
   ```
   → 自動で問題を検出・修正

3. **チームに相談**
   - GitHub Issuesで質問を投稿
   - チームメンバーに相談

---

## 🔄 今後の更新予定

このベストプラクティスは継続的に更新されます：

- [ ] CI/CD統合ガイド
- [ ] 本番環境デプロイメント設定
- [ ] チーム開発ワークフロー詳細
- [ ] パフォーマンスベンチマーク結果
- [ ] セキュリティ監査チェックリスト

---

## 📄 ライセンスと貢献

このドキュメントはプロジェクトの一部として管理されています。
改善提案や追加のベストプラクティスがあれば、プルリクエストを歓迎します！

---

**最終更新**: 2026-01-15
**バージョン**: 1.0.0
**メンテナー**: Amaejozu Development Team
