# Claude Code コンテナ環境 クイックスタートガイド

## 🚀 5分で始めるClaude Code

### 前提条件の確認

```bash
# Docker Desktopが起動していることを確認
docker --version

# VS Codeがインストールされていることを確認
code --version
```

### ステップ1: プロジェクトを開く

```bash
# プロジェクトディレクトリに移動
cd /path/to/Amaejozu-frontend

# VS Codeで開く
code .
```

### ステップ2: Dev Containerで起動

1. VS Codeが開いたら、右下に「コンテナーで再度開く」の通知が表示される
2. または、`Cmd/Ctrl + Shift + P` → `Dev Containers: Reopen in Container`を実行

### ステップ3: Claude Codeの起動

コンテナが起動したら、ターミナルで：

```bash
# Claude Codeを起動
claude

# または特定のタスクを指定して起動
claude "コンポーネントを作成して"
```

初回起動時、APIキーの入力を求められます。

---

## 💡 よく使うコマンド

### Claude Code関連

```bash
# Claude Codeを起動
claude

# バージョン確認
claude --version

# ヘルプを表示
claude --help
```

### VS Codeタスク（推奨）

`Cmd/Ctrl + Shift + P` → `Tasks: Run Task` で以下を選択：

- **Launch Claude Code**: Claude Codeを新しいターミナルで起動
- **Dev: Start Next.js**: 開発サーバーを起動
- **Build: Next.js Production**: 本番ビルドを実行
- **Lint: Check All Files**: ESLintでコードチェック
- **Fix File Permissions**: ファイル権限の問題を修正

### トラブルシューティング

```bash
# 権限エラーが出た場合
sudo chown -R vscode:vscode .

# node_modulesを再インストール
rm -rf node_modules && npm install

# Claude Codeを再インストール
sudo npm install -g @anthropic-ai/claude-code@latest
```

---

## 🎯 Claude Codeの効果的な使い方

### 1. 具体的な指示を与える

❌ 悪い例：
```
コンポーネントを作ってください
```

✅ 良い例：
```
ユーザープロフィールを表示するReactコンポーネントを作成してください。
- TypeScriptを使用
- Tailwind CSSでスタイリング
- プロパティ: name, email, avatarUrl
- src/components/UserProfile.tsxに配置
```

### 2. コンテキストを提供する

```
この化粧品価格比較アプリで、価格履歴をグラフ表示する機能を追加したい。
既存のPriceHistoryコンポーネント（src/components/PriceHistory.tsx）を
Chart.jsを使って改善してください。
```

### 3. ステップバイステップで進める

```
次の順序で実装をお願いします：
1. まず型定義を確認
2. APIエンドポイントを作成
3. フロントエンドのコンポーネントを実装
4. テストを追加
```

---

## 🔧 カスタマイズ（オプション）

### APIキーの設定場所

```
~/.claude/config.json
```

このファイルは自動的にコンテナ内にマウントされます。

### Git設定の確認

```bash
# コンテナ内で実行
git config --global user.name
git config --global user.email

# 未設定の場合
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### エイリアスの設定（オプション）

`~/.zshrc`に追加（コンテナ内）：

```bash
# Claude Code用のエイリアス
alias cc='claude'
alias ccode='claude'

# よく使うコマンド
alias dev='npm run dev'
alias build='npm run build'
alias lint='npm run lint'
```

---

## 📊 パフォーマンス最適化のヒント

### Windowsユーザー

1. **WSL2を使用**（強く推奨）
   ```powershell
   # WSL2の確認
   wsl --list --verbose
   ```

2. **プロジェクトをWSL内に配置**
   ```
   \\wsl$\Ubuntu\home\username\projects\Amaejozu-frontend
   ```

### macOSユーザー

1. **Docker Desktopの設定を最適化**
   - Resources → メモリを最低4GB以上に設定
   - VirtioFSを有効化（Settings → Experimental Features）

2. **named volumeを使用**（devcontainer.jsonで既に設定済み）

---

## 🤝 チーム開発での活用

### 1. コードレビューの依頼

```bash
# PRの差分を確認しながら
claude "このPRのコードレビューをしてください"
```

### 2. バグ調査

```bash
claude "src/components/ProductList.tsxで発生している無限ループの原因を調査して修正してください"
```

### 3. リファクタリング

```bash
claude "utils/api.tsのコードをTypeScriptの型安全性を高めるようにリファクタリングしてください"
```

---

## 📚 次のステップ

詳細なベストプラクティスについては、以下のドキュメントを参照してください：

- [完全版ベストプラクティスガイド](./CLAUDE_CODE_CONTAINER_BEST_PRACTICES.md)
- [推奨設定ファイル](.devcontainer/devcontainer.json.recommended)

---

## 🆘 サポート

問題が発生した場合：

1. [トラブルシューティングガイド](./CLAUDE_CODE_CONTAINER_BEST_PRACTICES.md#トラブルシューティング)を確認
2. GitHub Issuesで質問
3. チームメンバーに相談

---

**Happy Coding with Claude! 🎉**
