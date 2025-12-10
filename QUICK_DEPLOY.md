# 投資家向けデモURL作成手順（5分で完了）

## 最も簡単な方法：Vercel CLI

### ステップ1: Vercelにログイン
ターミナルで以下を実行：
```bash
npx vercel login
```
ブラウザが開くので、GitHubアカウントでログインしてください。

### ステップ2: デプロイ
ログイン後、以下を実行：
```bash
npx vercel --prod
```

これで完了！デモURLが表示されます。

---

## 代替方法：Vercel Web UI（GUIで簡単）

### ステップ1: GitHubにプッシュ
```bash
git init
git add .
git commit -m "Initial commit"
# GitHubでリポジトリを作成してから：
git remote add origin https://github.com/あなたのユーザー名/ami-japan-app.git
git push -u origin main
```

### ステップ2: Vercelでデプロイ
1. https://vercel.com にアクセス
2. GitHubアカウントでログイン
3. "Add New Project" をクリック
4. リポジトリを選択
5. "Deploy" をクリック

数分でデプロイ完了！

---

## デプロイ後のURL例
- 本番URL: `https://ami-japan-app.vercel.app`
- プレビューURL: `https://ami-japan-app-git-main.vercel.app`

URLは自動的に生成され、投資家に共有できます！

