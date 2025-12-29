import { useState, useEffect } from 'react';
import ChartDisplay from './ChartDisplay';
import TextDisplay from './TextDisplay';

const DisplayScreen = ({ config, onBack }) => {
  const [data, setData] = useState(null);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [displayMode, setDisplayMode] = useState('auto'); // 'auto', 'chart', 'text'
  const [chartType, setChartType] = useState(config.chartType);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdate, setLastUpdate] = useState(null);

  // データ取得関数
  const fetchData = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetch(config.url);

      if (!response.ok) {
        throw new Error('データの取得に失敗しました。Apps ScriptのデプロイURLを確認してください。');
      }

      const jsonData = await response.json();

      if (!jsonData.headers || !jsonData.rows) {
        throw new Error('データが見つかりませんでした');
      }

      setData(jsonData);
      setLastUpdate(new Date());

      // 初回ロード時に最初の列（タイムスタンプ以外）を選択
      if (!selectedColumn && jsonData.headers.length > 1) {
        setSelectedColumn(1); // B列（インデックス1）
      }
    } catch (err) {
      setError(err.message || '通信エラーが発生しました。接続を確認してください。');
    } finally {
      setLoading(false);
    }
  };

  // 初回ロードと自動更新
  useEffect(() => {
    fetchData();

    let intervalId;
    if (autoRefresh) {
      intervalId = setInterval(() => {
        fetchData();
      }, config.interval * 1000);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [autoRefresh, config.interval, config.url]);

  // 列の種類を判定（選択肢型 or 自由記述型）
  const getColumnType = (columnIndex) => {
    if (!data || !data.rows || columnIndex === null) return 'text';

    const columnData = data.rows
      .map(row => row[columnIndex])
      .filter(val => val && val.toString().trim() !== '');

    const uniqueValues = [...new Set(columnData)];

    // ユニークな値が10個以下で、重複がある場合は選択肢型
    if (uniqueValues.length <= 10 && columnData.length > uniqueValues.length) {
      return 'choice';
    }

    return 'text';
  };

  // データを集計
  const aggregateData = (columnIndex) => {
    if (!data || !data.rows || columnIndex === null) return [];

    const columnData = data.rows
      .map(row => row[columnIndex])
      .filter(val => val && val.toString().trim() !== '')
      .map(val => val.toString().trim());

    const counts = {};
    columnData.forEach(value => {
      counts[value] = (counts[value] || 0) + 1;
    });

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value, count: value }))
      .sort((a, b) => b.value - a.value);
  };

  // 表示モードを決定
  const getEffectiveDisplayMode = () => {
    if (displayMode === 'chart' || displayMode === 'text') {
      return displayMode;
    }

    // autoモードの場合、列の種類に基づいて決定
    const columnType = getColumnType(selectedColumn);
    return columnType === 'choice' ? 'chart' : 'text';
  };

  const currentDisplayMode = getEffectiveDisplayMode();
  const aggregatedData = aggregateData(selectedColumn);
  const columnTitle = data && selectedColumn !== null ? data.headers[selectedColumn] : '';

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* ヘッダー */}
      <header className="bg-white/10 backdrop-blur-md border-b border-white/20">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* 左側 */}
            <div>
              <h1 className="text-2xl font-bold text-white">リアルタイム表示</h1>
              {lastUpdate && (
                <p className="text-sm text-gray-300">
                  最終更新: {lastUpdate.toLocaleTimeString('ja-JP')}
                </p>
              )}
            </div>

            {/* 右側（制御ボタン） */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  autoRefresh
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                }`}
              >
                自動更新 {autoRefresh ? 'ON' : 'OFF'}
              </button>

              <button
                onClick={fetchData}
                disabled={loading}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
              >
                {loading ? '更新中...' : '手動更新'}
              </button>

              <button
                onClick={onBack}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors"
              >
                設定に戻る
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* エラー表示 */}
      {error && (
        <div className="max-w-7xl mx-auto px-6 mt-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      )}

      {/* コントロールパネル */}
      {data && (
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="bg-white/95 rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-6 flex-wrap">
              {/* 列選択 */}
              <div className="flex-1 min-w-[250px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  表示する質問
                </label>
                <select
                  value={selectedColumn || ''}
                  onChange={(e) => setSelectedColumn(parseInt(e.target.value, 10))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                >
                  {data.headers.slice(1).map((header, index) => (
                    <option key={index + 1} value={index + 1}>
                      {String.fromCharCode(66 + index)}列: {header}
                    </option>
                  ))}
                </select>
              </div>

              {/* 表示モード切り替え */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  表示モード
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setDisplayMode('auto')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      displayMode === 'auto'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    自動
                  </button>
                  <button
                    onClick={() => setDisplayMode('chart')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      displayMode === 'chart'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    グラフ
                  </button>
                  <button
                    onClick={() => setDisplayMode('text')}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      displayMode === 'text'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    テキスト
                  </button>
                </div>
              </div>

              {/* グラフ種類選択 */}
              {currentDisplayMode === 'chart' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    グラフ種類
                  </label>
                  <select
                    value={chartType}
                    onChange={(e) => setChartType(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="bar">縦棒グラフ</option>
                    <option value="barHorizontal">横棒グラフ</option>
                    <option value="pie">円グラフ</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* コンテンツ表示エリア */}
      {data && selectedColumn !== null && (
        <div className="max-w-7xl mx-auto px-6 pb-8">
          <div className="bg-white/95 rounded-xl shadow-lg p-8">
            {/* 質問タイトル */}
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
              {columnTitle}
            </h2>

            {/* グラフまたはテキスト表示 */}
            {currentDisplayMode === 'chart' ? (
              <ChartDisplay data={aggregatedData} chartType={chartType} />
            ) : (
              <TextDisplay data={aggregatedData} />
            )}
          </div>
        </div>
      )}

      {/* ローディング（初回のみ） */}
      {loading && !data && (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
            <p className="text-white mt-4">読み込み中...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default DisplayScreen;
