# 📊 Googleフォーム リアルタイム表示アプリ

Googleフォームの回答をリアルタイムで読み込み、グラフまたはテキストで視覚的に表示するWebアプリケーション。セミナーやプレゼンテーションでの利用に最適です。

![License](https://img.shields.io/badge/License-MIT-green.svg)
![React](https://img.shields.io/badge/React-18-blue.svg)
![Vite](https://img.shields.io/badge/Vite-5-purple.svg)

## ✨ 主要機能

### 📡 データ取得
- **リアルタイム更新**: 設定した間隔で自動的にデータを取得
- **手動更新**: ボタンクリックで即座にデータを更新
- **Google Apps Script連携**: スプレッドシートのデータをJSON形式で取得

### 📈 表示モード

#### グラフ表示
- 縦棒グラフ
- 横棒グラフ
- 円グラフ（パーセンテージ表示）
- 選択肢型の質問に最適

#### テキスト表示
- 最も多い回答を中央に大きく表示
- その他の回答を円状に配置
- 回答数に応じてサイズと透明度が変化
- 自由記述型の質問に最適

### 🎨 UI/UX
- レスポンシブデザイン
- スムーズなアニメーション
- 直感的な操作性
- プロジェクター投影に最適化

## 🚀 クイックスタート

### 必要要件

- Node.js 18.0以上
- npm 9.0以上
- モダンなウェブブラウザ（Chrome、Firefox、Safari、Edge）

### インストール

\`\`\`bash
# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
\`\`\`

## 📝 セットアップガイド

### 1. Googleフォームの準備

1. Googleフォームを作成
2. 質問を追加（選択肢型または自由記述型）
3. フォームの回答先スプレッドシートを確認

### 2. Apps Scriptの設定

1. スプレッドシートを開く
2. **「拡張機能」** → **「Apps Script」** を選択
3. 以下のコードを貼り付けて保存

\`\`\`javascript
function doGet(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('フォームの回答 1');
  const data = sheet.getDataRange().getValues();

  const headers = data[0];
  const rows = data.slice(1);

  const jsonData = {
    headers: headers,
    rows: rows
  };

  const output = ContentService.createTextOutput(JSON.stringify(jsonData));
  output.setMimeType(ContentService.MimeType.JSON);

  return output;
}
\`\`\`

4. **「デプロイ」** → **「新しいデプロイ」** を選択
5. **「種類の選択」** → **「ウェブアプリ」**
6. 設定:
   - **次のユーザーとして実行**: 自分
   - **アクセスできるユーザー**: 全員
7. **「デプロイ」** をクリック
8. 表示されたウェブアプリURLをコピー

### 3. アプリの使用

1. アプリを開く
2. コピーしたApps Script URLを入力
3. グラフの種類と更新間隔を設定
4. **「表示を開始」** をクリック
5. 表示する質問を選択
6. 必要に応じてグラフ種類や表示モードを変更

## 🎯 使用例

### セミナーでの使用

1. 参加者にGoogleフォームのURLを共有
2. アプリで質問を表示
3. 参加者が回答するとリアルタイムで結果が更新
4. グラフやテキストで視覚的に表示

### プレゼンテーションでの使用

1. プロジェクターに画面を投影
2. 質問ごとに表示を切り替え
3. 回答の集計結果をリアルタイムで共有

## 📂 プロジェクト構造

\`\`\`
google-forms-realtime-app/
├── src/
│   ├── components/
│   │   ├── SetupScreen.jsx      # 初期設定画面
│   │   ├── DisplayScreen.jsx    # メイン表示画面
│   │   ├── ChartDisplay.jsx     # グラフ表示
│   │   └── TextDisplay.jsx      # テキスト表示
│   ├── App.jsx                   # メインアプリ
│   ├── main.jsx                  # エントリーポイント
│   └── index.css                 # グローバルスタイル
├── public/                       # 静的ファイル
├── package.json                  # 依存関係
├── vite.config.js               # Vite設定
├── tailwind.config.js           # Tailwind CSS設定
└── README.md                     # このファイル
\`\`\`

## 🛠️ 技術スタック

- **フレームワーク**: React 18
- **ビルドツール**: Vite 5
- **スタイリング**: Tailwind CSS
- **グラフライブラリ**: Recharts
- **言語**: JavaScript (ES6+)

## 🎨 カラーパレット

グラフで使用される8色の配色:

\`\`\`javascript
['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#FFC658', '#FF6B9D']
\`\`\`

## 📋 データ構造

### Apps ScriptからのJSONレスポンス

\`\`\`json
{
  "headers": ["タイムスタンプ", "質問1", "質問2", "質問3"],
  "rows": [
    ["2025-12-29T10:03:52", "回答1-1", "回答1-2", "回答1-3"],
    ["2025-12-29T10:04:23", "回答2-1", "回答2-2", "回答2-3"]
  ]
}
\`\`\`

## 🔧 カスタマイズ

### 更新間隔の変更

初期設定画面で1〜60秒の範囲で設定可能。

### グラフの色変更

\`src/components/ChartDisplay.jsx\` の \`COLORS\` 配列を編集:

\`\`\`javascript
const COLORS = [
  '#your-color-1',
  '#your-color-2',
  // ...
];
\`\`\`

### テキスト表示のレイアウト調整

\`src/components/TextDisplay.jsx\` の \`radius\` 変数を変更:

\`\`\`javascript
const radius = 250; // デフォルト: 250px
\`\`\`

## ⚠️ トラブルシューティング

### データが表示されない

1. Apps ScriptのURLが正しいか確認
2. ブラウザのコンソールでエラーを確認
3. Apps ScriptのURLを直接開いてJSONが表示されるか確認
4. スプレッドシートのシート名が「フォームの回答 1」と一致しているか確認

### CORS エラーが発生する

Apps Scriptのデプロイ設定で「アクセスできるユーザー」が「全員」になっているか確認。

### グラフが表示されない

データの形式が正しいか確認。選択肢型の質問の場合、重複する回答が存在する必要があります。

## 📄 ライセンス

このプロジェクトは[MITライセンス](../../LICENSE)の下で公開されています。

## 🤝 コントリビューション

バグ報告や機能提案は、GitHubのIssuesでお願いします。

## 🌟 今後の機能追加予定

- [ ] 複数スプレッドシート対応
- [ ] グラフの画像エクスポート
- [ ] CSVデータのダウンロード
- [ ] カスタムカラーテーマ
- [ ] 時間範囲でのフィルタリング
- [ ] LocalStorageでの設定保存

---

**Made with ❤️ using React + Vite + Tailwind CSS**
