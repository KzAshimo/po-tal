import connection from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken"; // JWTライブラリのインポート

// JWTの秘密鍵は環境変数などで管理してください
const JWT_SECRET = process.env.JWT_SECRET || 'dan-key';

export async function POST(req: Request) {
    try {
        // リクエストヘッダーからJWTを取得
        const token = req.headers.get('Authorization')?.split(' ')[1]; // "Bearer token" の形式で送信されることを想定

        if (!token) {
            return NextResponse.json({ message: 'トークンが見つかりません' }, { status: 401 });
        }

        // JWTをデコードしてユーザーIDを取得
        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id; // JWTのペイロードからユーザーIDを取得

        if (!userId) {
            return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 401 });
        }

        // リクエストデータの受け取り（オブジェクト形式を仮定）
        const { latitude, longitude } = await req.json();

        // デバッグ用のログ出力
        console.log("Received data:", { latitude, longitude, userId });

        // SQLクエリの実行
        const [result] = await connection.execute(
            `INSERT INTO location_logs (user_id, latitude, longitude) VALUES (?, ?, ?)`,
            [userId, latitude, longitude]
        );

        // 挿入されたレコードのIDを取得
        const insertId = result.insertId;

        // 成功レスポンス
        return NextResponse.json({ message: '出動開始', id: insertId }, { status: 200 });
    } catch (error) {
        // エラー時のログ出力
        console.error("Error during database operation:", error);

        // エラーレスポンス
        return NextResponse.json({ message: 'エラー発生', error: error.message }, { status: 500 });
    }
}
