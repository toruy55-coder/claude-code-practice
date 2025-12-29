/**
 * Google Apps Script - Googleフォーム回答取得用
 * 
 * このスクリプトは、Googleフォームの回答が保存されているスプレッドシートから
 * データを取得し、JSON形式で返すウェブアプリケーションです。
 * 
 * セットアップ手順:
 * 1. Googleスプレッドシートで「拡張機能」→「Apps Script」を開く
 * 2. このコードを貼り付けて保存
 * 3. 「デプロイ」→「新しいデプロイ」を選択
 * 4. 「種類の選択」→「ウェブアプリ」を選択
 * 5. 「次のユーザーとして実行」→「自分」を選択
 * 6. 「アクセスできるユーザー」→「全員」を選択
 * 7. 「デプロイ」をクリック
 * 8. 表示されたウェブアプリURLをコピー
 */

function doGet(e) {
  try {
    // スプレッドシートのシート名を指定（必要に応じて変更）
    const sheetName = 'フォームの回答 1';
    
    // アクティブなスプレッドシートから指定されたシートを取得
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    
    if (!sheet) {
      return createErrorResponse(`シート "${sheetName}" が見つかりません`);
    }
    
    // シート全体のデータを取得
    const data = sheet.getDataRange().getValues();
    
    if (data.length === 0) {
      return createErrorResponse('データが見つかりません');
    }
    
    // 1行目をヘッダーとして取得
    const headers = data[0];
    
    // 2行目以降をデータ行として取得
    const rows = data.slice(1);
    
    // JSON形式でデータを構造化
    const jsonData = {
      headers: headers,
      rows: rows,
      totalRows: rows.length,
      lastUpdate: new Date().toISOString()
    };
    
    // JSON形式でレスポンスを返す
    const output = ContentService.createTextOutput(JSON.stringify(jsonData));
    output.setMimeType(ContentService.MimeType.JSON);
    
    return output;
    
  } catch (error) {
    return createErrorResponse(error.message);
  }
}

/**
 * エラーレスポンスを作成する関数
 */
function createErrorResponse(message) {
  const errorData = {
    error: true,
    message: message
  };
  
  const output = ContentService.createTextOutput(JSON.stringify(errorData));
  output.setMimeType(ContentService.MimeType.JSON);
  
  return output;
}

/**
 * テスト用関数（Apps Scriptエディタで実行可能）
 * この関数を実行すると、スプレッドシートのデータをログに出力します
 */
function testGetData() {
  const result = doGet();
  const content = result.getContent();
  const data = JSON.parse(content);
  
  Logger.log('ヘッダー: ' + JSON.stringify(data.headers));
  Logger.log('データ行数: ' + data.rows.length);
  Logger.log('最初の5行: ' + JSON.stringify(data.rows.slice(0, 5)));
}
