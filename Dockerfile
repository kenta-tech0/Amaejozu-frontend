# 1. ベースイメージの指定
FROM node:22-slim

# 2. gitのインストール
RUN apt-get update && apt-get install -y git

# 3. 作業ディレクトリの指定
# WORKDIR /app

# 4. 依存関係ファイルの先行コピー
# COPY package*.json ./

# 5. 依存関係のインストール
# RUN npm ci
# RUN npm install

# 6. プロジェクト全体のソースコードをコピー
# COPY . .

# 7. Next.jsが使用するポートを公開
EXPOSE 3000

# 8. コンテナ起動時のデフォルトコマンド (コメントアウト)
# Dev Containersでは postAttachCommand を使用するため、このCMDは不要。
# このイメージを他の目的（本番実行など）で再利用する場合は、
# その実行環境側で適切なコマンドを指定する。
# CMD ["npm", "run", "dev", "--", "--hostname", "0.0.0.0"]
