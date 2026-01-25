# バックエンド API 仕様書（フロントエンド連携用）

フロントエンドとの連携に必要なバックエンド側の実装仕様です。

## 1. 認証エンドポイント

### POST /auth/login

ユーザーログイン。成功時にHttpOnly Cookieでアクセストークンを設定。

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**成功レスポンス (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Set-Cookie ヘッダー:**
```
Set-Cookie: access_token=<jwt>; HttpOnly; SameSite=Lax; Path=/; Max-Age=604800
```

**エラーレスポンス (401):**
```json
{
  "detail": "メールアドレスまたはパスワードが正しくありません"
}
```

---

### POST /auth/signup

新規ユーザー登録。成功時に自動ログイン（Cookie設定）。

**リクエスト:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"  // optional
}
```

**成功レスポンス (201):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**Set-Cookie ヘッダー:** ログインと同様

**エラーレスポンス (400):**
```json
{
  "detail": "このメールアドレスは既に登録されています"
}
```

---

### POST /auth/logout

ログアウト。Cookieを削除。

**成功レスポンス (200):**
```json
{
  "message": "ログアウトしました"
}
```

**Set-Cookie ヘッダー:**
```
Set-Cookie: access_token=; HttpOnly; SameSite=Lax; Path=/; Max-Age=0
```

---

### GET /auth/me

現在のログインユーザー情報を取得。

**成功レスポンス (200):**
```json
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "name": "User Name"
  }
}
```

**エラーレスポンス (401):**
```json
{
  "detail": "認証が必要です"
}
```

---

### POST /auth/forgot-password

パスワードリセットメール送信。（既存実装を想定）

**リクエスト:**
```json
{
  "email": "user@example.com"
}
```

**成功レスポンス (200):**
```json
{
  "success": true,
  "message": "パスワードリセットメールを送信しました"
}
```

---

### POST /auth/reset-password

パスワードリセット実行。（既存実装を想定）

**リクエスト:**
```json
{
  "token": "reset-token-from-email",
  "new_password": "newpassword123"
}
```

**成功レスポンス (200):**
```json
{
  "success": true,
  "message": "パスワードを変更しました"
}
```

---

## 2. CORS 設定

FastAPIの`CORSMiddleware`で以下を設定：

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",        # 開発環境
        "https://your-production.com",  # 本番環境
    ],
    allow_credentials=True,  # Cookie送受信に必須
    allow_methods=["*"],
    allow_headers=["*"],
)
```

**重要:**
- `allow_credentials=True` の場合、`allow_origins=["*"]` は使用不可
- 具体的なオリジンを指定すること

---

## 3. Cookie 設定

JWTトークンをCookieで返却する際の設定：

```python
from fastapi import Response

def set_auth_cookie(response: Response, token: str):
    response.set_cookie(
        key="access_token",
        value=token,
        httponly=True,           # JavaScript からアクセス不可
        samesite="lax",          # CSRF対策
        secure=settings.COOKIE_SECURE,  # 本番: True, 開発: False
        max_age=7 * 24 * 60 * 60,  # 7日間
        path="/",
    )

def clear_auth_cookie(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="lax",
        secure=settings.COOKIE_SECURE,
        path="/",
    )
```

---

## 4. 認証依存関係

Cookieからトークンを取得する依存関係：

```python
from fastapi import Cookie, HTTPException, status

async def get_current_user(access_token: str = Cookie(None)):
    if not access_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="認証が必要です"
        )

    try:
        payload = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="無効なトークンです")
    except JWTError:
        raise HTTPException(status_code=401, detail="無効なトークンです")

    user = await get_user_by_id(user_id)
    if user is None:
        raise HTTPException(status_code=401, detail="ユーザーが見つかりません")

    return user
```

---

## 5. エラーレスポンス形式

全てのエラーレスポンスは以下の形式で統一：

```json
{
  "detail": "エラーメッセージ",
  "code": "ERROR_CODE",        // optional
  "errors": [                  // optional (バリデーションエラー時)
    {
      "field": "email",
      "message": "有効なメールアドレスを入力してください"
    }
  ]
}
```

---

## 6. 環境変数

バックエンドに必要な環境変数：

```bash
# JWT設定
SECRET_KEY=your-secret-key
ACCESS_TOKEN_EXPIRE_DAYS=7

# Cookie設定
COOKIE_SECURE=false  # 本番では true

# CORS設定
CORS_ORIGINS=http://localhost:3000,https://your-production.com
```

---

## 7. HTTPステータスコード

| コード | 用途 |
|--------|------|
| 200 | 成功（取得、更新、削除） |
| 201 | 作成成功 |
| 204 | 成功（レスポンスボディなし） |
| 400 | クライアントエラー（バリデーション失敗等） |
| 401 | 認証エラー（未ログイン、トークン無効） |
| 403 | 認可エラー（権限なし） |
| 404 | リソース不存在 |
| 422 | リクエスト形式エラー |
| 429 | レート制限 |
| 500 | サーバーエラー |

---

## 8. 実装チェックリスト

- [ ] `/auth/login` エンドポイント（Cookie設定付き）
- [ ] `/auth/signup` エンドポイント（Cookie設定付き）
- [ ] `/auth/logout` エンドポイント（Cookie削除）
- [ ] `/auth/me` エンドポイント
- [ ] CORS設定（`allow_credentials=True`）
- [ ] Cookie認証の依存関係
- [ ] 環境変数でCookie Secure設定を切り替え
