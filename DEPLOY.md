# デプロイ手順

AMI Japanアプリケーションをインターネットに公開する方法です。

## 方法1: Vercel（推奨・最も簡単）

### 前提条件
- GitHubアカウント
- Vercelアカウント（無料で作成可能）

### 手順

1. **GitHubにリポジトリを作成**
   ```bash
   # プロジェクトをGitリポジトリとして初期化
   git init
   git add .
   git commit -m "Initial commit"
   
   # GitHubで新しいリポジトリを作成し、以下を実行
   git remote add origin https://github.com/あなたのユーザー名/ami-japan-app.git
   git branch -M main
   git push -u origin main
   ```

2. **Vercelにデプロイ**
   - [Vercel](https://vercel.com) にアクセス
   - 「Sign Up」でGitHubアカウントでログイン
   - 「Add New Project」をクリック
   - GitHubリポジトリを選択
   - 設定を確認（自動検出されるはず）:
     - Framework Preset: Vite
     - Build Command: `npm run build`
     - Output Directory: `dist`
   - 「Deploy」をクリック
   - 数分でデプロイ完了！URLが表示されます

3. **カスタムドメイン（オプション）**
   - Vercelのプロジェクト設定からカスタムドメインを追加可能

---

## 方法2: Netlify

### 前提条件
- GitHubアカウント
- Netlifyアカウント（無料で作成可能）

### 手順

1. **GitHubにリポジトリを作成**（方法1と同じ）

2. **Netlifyにデプロイ**
   - [Netlify](https://www.netlify.com) にアクセス
   - 「Sign up」でGitHubアカウントでログイン
   - 「Add new site」→「Import an existing project」をクリック
   - GitHubリポジトリを選択
   - ビルド設定を確認:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - 「Deploy site」をクリック
   - 数分でデプロイ完了！

3. **カスタムドメイン（オプション）**
   - Netlifyのサイト設定からカスタムドメインを追加可能

---

## 方法3: GitHub Pages

### 手順

1. **vite.config.tsを更新**
   ```typescript
   export default defineConfig({
     plugins: [react()],
     base: '/ami-japan-app/', // リポジトリ名に合わせる
   })
   ```

2. **GitHub Actionsで自動デプロイ**
   - `.github/workflows/deploy.yml` を作成（下記参照）

3. **GitHubリポジトリの設定**
   - Settings → Pages → Source: GitHub Actions を選択

---

## 方法4: Firebase Hosting

### 手順

1. **Firebase CLIをインストール**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Firebaseプロジェクトを初期化**
   ```bash
   firebase init hosting
   # 設定:
   # - Public directory: dist
   # - Single-page app: Yes
   # - Set up automatic builds: No
   ```

3. **デプロイ**
   ```bash
   npm run build
   firebase deploy
   ```

---

## ローカルでビルドをテスト

デプロイ前に、ローカルでビルドが正常に動作するか確認：

```bash
npm run build
npm run preview
```

`http://localhost:4173` でビルド結果を確認できます。

---

## 注意事項

- ローカルストレージを使用しているため、ブラウザを変えるとデータは共有されません
- 本番環境では、バックエンドAPIとデータベースの実装を検討してください
- HTTPSは自動で有効になります（Vercel/Netlify）

---

## 推奨

**Vercel** が最も簡単で、自動デプロイ、無料HTTPS、高速CDNが含まれています。

