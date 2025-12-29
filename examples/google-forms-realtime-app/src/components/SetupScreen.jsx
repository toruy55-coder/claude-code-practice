import { useState } from 'react';

const SetupScreen = ({ onStart }) => {
  const [url, setUrl] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [interval, setInterval] = useState(5);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // バリデーション
    if (!url.trim()) {
      setError('有効なApps Script URLを入力してください');
      return;
    }

    if (interval < 1 || interval > 60) {
      setError('更新間隔は1〜60秒の範囲で設定してください');
      return;
    }

    setError('');
    onStart({
      url: url.trim(),
      chartType,
      interval: parseInt(interval, 10),
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            リアルタイム表示アプリ
          </h1>
          <p className="text-gray-600">
            Googleフォームの回答をリアルタイムで表示
          </p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Apps Script URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://script.google.com/macros/s/[ID]/exec"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Google Apps ScriptでデプロイしたウェブアプリのURLを入力
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              デフォルトのグラフ種類
            </label>
            <select
              value={chartType}
              onChange={(e) => setChartType(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option value="bar">縦棒グラフ</option>
              <option value="barHorizontal">横棒グラフ</option>
              <option value="pie">円グラフ</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              自動更新間隔（秒）
            </label>
            <input
              type="number"
              min="1"
              max="60"
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              1〜60秒の範囲で設定（デフォルト: 5秒）
            </p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            表示を開始
          </button>
        </form>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            セットアップガイド
          </h3>
          <ol className="text-xs text-blue-800 space-y-1 list-decimal list-inside">
            <li>Googleフォームの回答先スプレッドシートを開く</li>
            <li>「拡張機能」→「Apps Script」を選択</li>
            <li>提供されたコードを貼り付けて保存</li>
            <li>「デプロイ」→「新しいデプロイ」を選択</li>
            <li>「アクセスできるユーザー」を「全員」に設定</li>
            <li>デプロイ後に表示されるURLをコピー</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default SetupScreen;
