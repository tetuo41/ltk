# デプロイメントガイド

このドキュメントでは、LTKウェブサイトを各種無料ホスティングサービスにデプロイする方法を説明します。

## 1. GitHub Pages（推奨）

### 手順
1. GitHubアカウントを作成（無料）
2. 新しいリポジトリを作成
3. プロジェクトファイルをアップロード
4. Settings → Pages → Source を "Deploy from a branch" に設定
5. Branch を "main" に設定
6. 数分でデプロイ完了

### メリット
- 完全無料
- カスタムドメイン対応
- SSL証明書自動設定
- GitHubアカウントがあれば簡単

### URL例
`https://yourusername.github.io/ltk-website`

## 2. Netlify

### 手順
1. [Netlify](https://netlify.com)にアクセス
2. アカウント作成（無料）
3. "Add new site" → "Deploy manually"
4. プロジェクトフォルダをドラッグ&ドロップ
5. 即座にデプロイ完了

### メリット
- 最速デプロイ（1分以内）
- フォームハンドリング機能
- 継続デプロイメント
- カスタムドメイン対応

### URL例
`https://random-name-123456.netlify.app`

## 3. Vercel

### 手順
1. [Vercel](https://vercel.com)にアクセス
2. GitHubアカウントで連携
3. リポジトリをインポート
4. 自動デプロイ設定
5. デプロイ完了

### メリット
- 高速CDN
- 自動プレビュー機能
- 優秀なパフォーマンス
- GitHubとの連携が簡単

### URL例
`https://ltk-website-abc123.vercel.app`

## 4. Surge.sh

### 手順
```bash
# Node.jsをインストール済みの場合
npm install -g surge

# プロジェクトディレクトリで実行
cd ltk
surge

# ドメイン名を入力（例: ltk-tournament.surge.sh）
# メールアドレスとパスワードを設定
```

### メリット
- コマンドライン操作
- カスタムドメイン対応
- 簡単更新プロセス
- 開発者向け

### URL例
`https://ltk-tournament.surge.sh`

## 5. Firebase Hosting

### 手順
1. [Firebase Console](https://console.firebase.google.com/)にアクセス
2. 新しいプロジェクトを作成
3. Firebase CLIをインストール
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

### メリット
- Googleのインフラ
- 高速CDN
- 詳細なアナリティクス
- 他のFirebaseサービスとの連携

## 推奨デプロイメント戦略

### 初心者向け: Netlify
- ドラッグ&ドロップで最も簡単
- 即座にオンライン公開
- 技術的知識不要

### 開発者向け: GitHub Pages
- バージョン管理と組み合わせ
- コラボレーション機能
- プルリクエストでのプレビュー

### 高性能重視: Vercel
- 最高のパフォーマンス
- 自動最適化
- エッジ配信

## カスタムドメインの設定

全てのサービスでカスタムドメインを設定できます：

1. ドメインを購入（お名前.com、ムームードメインなど）
2. ホスティングサービスでカスタムドメインを追加
3. DNSレコードを設定
4. SSL証明書が自動で設定される

### 推奨ドメイン例
- `ltk-tournament.com`
- `k4sen-ltk.net`
- `league-k4sen.org`

## 更新手順

### GitHub Pages
```bash
git add .
git commit -m "結果更新"
git push origin main
```

### Netlify
- 管理画面でファイルを再アップロード
- または、GitHubと連携して自動デプロイ

### Vercel
- GitHubにプッシュすれば自動デプロイ

### Surge.sh
```bash
surge
```

## パフォーマンス最適化

デプロイ前に以下を確認：

1. **画像最適化**: WebP形式を使用
2. **CSS/JS最小化**: 本番環境では圧縮版を使用
3. **キャッシュ設定**: 適切なキャッシュヘッダーを設定
4. **CDN活用**: 全てのサービスでCDNが利用可能

## セキュリティ設定

含まれているセキュリティヘッダー：
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`

## トラブルシューティング

### よくある問題

1. **ページが表示されない**
   - ファイルパスの確認
   - index.htmlがルートディレクトリにあるか確認

2. **CSS/JSが読み込まれない**
   - 相対パスの確認
   - ファイル名の大文字小文字を確認

3. **モバイルで表示が崩れる**
   - viewportメタタグの確認
   - レスポンシブCSSの動作確認

### サポート

各サービスの公式ドキュメント：
- [GitHub Pages](https://docs.github.com/pages)
- [Netlify](https://docs.netlify.com/)
- [Vercel](https://vercel.com/docs)
- [Surge.sh](https://surge.sh/help/)

## 費用

全てのサービスで基本機能は**完全無料**で利用できます。

プレミアム機能（必要に応じて）：
- カスタムドメイン: 年間1,000-3,000円程度
- 追加帯域幅: 月額数百円〜
- プレミアムサポート: 月額数千円〜