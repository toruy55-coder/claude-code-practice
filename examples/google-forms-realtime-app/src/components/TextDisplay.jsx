const TextDisplay = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-500 py-12">
        データがありません
      </div>
    );
  }

  const totalCount = data.reduce((sum, item) => sum + item.count, 0);

  // 最も多い回答
  const topAnswer = data[0];

  // その他の回答
  const otherAnswers = data.slice(1);

  // 中央のテキストサイズを計算（60px + 回答数×10px、最大120px）
  const mainFontSize = Math.min(60 + topAnswer.count * 10, 120);

  // 周囲の回答の配置を計算
  const radius = 250; // 半径250px
  const calculatePosition = (index, total) => {
    const angle = (index / total) * 2 * Math.PI - Math.PI / 2; // -90度から開始
    const x = Math.cos(angle) * radius;
    const y = Math.sin(angle) * radius;

    // 文字の向きを決定（左右の場合は通常、上下の場合は90度回転）
    const rotation = Math.abs(x) < 100 ? -90 : 0;

    return { x, y, rotation };
  };

  return (
    <div className="relative w-full" style={{ height: '600px' }}>
      {/* 中央のメイン表示 */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center animate-pulse-slow">
          <div
            className="font-bold text-indigo-600 leading-tight mb-2"
            style={{ fontSize: `${mainFontSize}px` }}
          >
            {topAnswer.name}
          </div>
          <div className="text-2xl text-gray-600 font-semibold">
            ×{topAnswer.count}
          </div>
        </div>
      </div>

      {/* 周囲のサブ表示 */}
      {otherAnswers.length > 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative" style={{ width: '600px', height: '600px' }}>
            {otherAnswers.map((answer, index) => {
              const { x, y, rotation } = calculatePosition(index, otherAnswers.length);

              // フォントサイズ: 30px + 回答数×5px（最大50px）
              const fontSize = Math.min(30 + answer.count * 5, 50);

              // 透明度: 70% + 回答割合×30%
              const opacity = 0.7 + (answer.count / totalCount) * 0.3;

              return (
                <div
                  key={index}
                  className="absolute text-center transition-all duration-1000"
                  style={{
                    left: '50%',
                    top: '50%',
                    transform: `translate(-50%, -50%) translate(${x}px, ${y}px) rotate(${rotation}deg)`,
                    opacity,
                  }}
                >
                  <div
                    className="font-semibold text-gray-700 whitespace-nowrap"
                    style={{ fontSize: `${fontSize}px` }}
                  >
                    {answer.name}
                  </div>
                  <div
                    className="text-sm text-gray-500 font-medium"
                    style={{ fontSize: `${fontSize * 0.4}px` }}
                  >
                    ×{answer.count}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextDisplay;
