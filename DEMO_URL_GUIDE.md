# 🚀 投資家向けデモURL作成ガイド

## ⚡ 最速方法（推奨）：Netlify Drop（5分）

### ステップ1: ビルドファイルを準備
既にビルド済みです！`dist`フォルダが準備できています。

### ステップ2: Netlify Dropでデプロイ
1. https://app.netlify.com/drop にアクセス
2. `dist`フォルダをドラッグ&ドロップ
3. 数秒でデプロイ完了！
4. URLが自動生成されます（例: `https://random-name-123.netlify.app`）

**メリット**: GitHubアカウント不要、超簡単！

---

## 📋 方法2：Vercel（推奨・プロフェッショナル）

### ステップ1: GitHubにリポジトリを作成
1. https://github.com/new にアクセス
2. リポジトリ名: `ami-japan-app`（任意）
3. "Create repository" をクリック

### ステップ2: コードをプッシュ
ターミナルで以下を実行：

```bash
git remote add origin https://github.com/あなたのユーザー名/ami-japan-app.git
git branch -M main
git push -u origin main
```

### ステップ3: Vercelでデプロイ
1. https://vercel.com にアクセス
2. "Sign Up" → GitHubアカウントでログイン
3. "Add New Project" をクリック
4. リポジトリ `ami-japan-app` を選択
5. 設定を確認（自動検出されます）:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. "Deploy" をクリック
7. 2-3分で完了！

**デプロイ後のURL例**: `https://ami-japan-app.vercel.app`

---

## 🎯 方法3：Vercel CLI（コマンドライン）

### ステップ1: ログイン
```bash
npx vercel login
```
ブラウザが開くので、GitHubアカウントでログイン

### ステップ2: デプロイ
```bash
npx vercel --prod
```

完了！URLが表示されます。

---

## ✅ デプロイ前の確認事項

✅ ビルドが正常に完了している（`npm run build`）
✅ `dist`フォルダが生成されている
✅ ローカルで動作確認済み（`npm run preview`）

---

## 📱 デプロイ後の確認

- [ ] アプリが正常に表示される
- [ ] チャットボットが動作する
- [ ] カルテ記録機能が動作する
- [ ] 言語切り替えが動作する
- [ ] ロゴが表示される

---

## 🔗 カスタムドメイン（オプション）

デプロイ後、Vercel/Netlifyの設定からカスタムドメインを追加できます。

---

## 💡 推奨

**投資家へのプレゼン用**: **Netlify Drop** が最も簡単で迅速です！
**本格運用**: **Vercel** がおすすめ（自動デプロイ、高速CDN）

