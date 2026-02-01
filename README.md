# code-check-lab

コードレビュー練習問題をAI生成する

## 🚀 主な機能

### 1. AIによるパーソナライズされた問題生成
- **多言語対応**: Kotlin, Swift, TypeScript, Rust, Goなど、主要な12言語から選択可能。
- **難易度調整**: 初級（Lv.1）から上級（Lv.10）まで、自身のスキルに合わせた難易度で問題を生成。
- **現実的なシナリオ**: セキュリティ、パフォーマンス、保守性、可読性など、実務で遭遇しそうな多様な観点の「欠陥」を含むコードを生成。

### 2. AIによる精密な自動採点
- **個別評価**: 各指摘事項に対して「意図を理解できているか」「説明が十分か」をAIが個別に採点。
- **詳細なフィードバック**: 回答に対する具体的なアドバイスを提供。
- **総合スコアリング**: 100点満点でのスコアと、全体的な講評を表示。

## 🔄 学習のフロー

1. **セットアップ**: 言語と難易度を選び「問題を生成」をクリック。
2. **レビュー**: 表示されたコードの問題点を探し、テキストエリアに指摘を記入。
3. **採点**: 「回答を送信」ボタンでAIがレビュー内容を客観評価。
4. **振り返り**: 解説とフィードバックを確認し、次の問題へ。

## ローカル実行

### 必要な環境

- Node.js 20以上

### セットアップ

```bash
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開く

### ビルド

```bash
npm run build
```

`dist`フォルダに成果物が出力される

### プレビュー

```bash
npm run preview
```

ビルド成果物をローカルで確認できる

### API設定（ローカル実行時）

本番環境のAPIはGitHub Pagesからのリクエストのみ受け付けるため、ローカル実行時は`src/api/claude.js`を以下のように修正してください。

```javascript
// 変更前
const API_ENDPOINT = 'https://code-review-trainer-api.wakanatsuki787.workers.dev/'

// 変更後
const API_ENDPOINT = 'https://api.anthropic.com/v1/messages'
```

また、各`fetch`呼び出しのヘッダーにAPIキーを追加してください。

```javascript
headers: {
  'Content-Type': 'application/json',
  'x-api-key': 'YOUR_ANTHROPIC_API_KEY',  // 追加
  'anthropic-version': '2023-06-01',       // 追加
  'anthropic-dangerous-direct-browser-access': 'true',  // 追加
},
```

APIキーは[Anthropic Console](https://console.anthropic.com/)から取得できます。

**注意**: APIキーをコミットしないでください。
