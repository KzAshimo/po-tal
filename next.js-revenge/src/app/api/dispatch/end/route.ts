import connection from "@/lib/db";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || 'dan-key'; // JWTシークレットを取得

export async function POST(req: Request) {
    try {
        const { id, latitude, longitude } = await req.json();

        // トークンをヘッダーから取得
        const token = req.headers.get('Authorization')?.split(' ')[1]; // Bearer トークンを取得
        if (!token) {
            return NextResponse.json({ message: 'トークンが見つかりません。' }, { status: 401 });
        }

        // トークンを検証し、dispatchIdを取得
        const decodedToken = jwt.verify(token, JWT_SECRET);
        const dispatchId = decodedToken.dispatchId; // dispatchIdを取得

        // データベースの更新処理
        const [updateResult] = await connection.execute(
            `UPDATE location_logs 
             SET end_time = NOW(), 
                 end_latitude = ?, 
                 end_longitude = ? 
             WHERE id = ? AND dispatch_id = ?`, // dispatchIdも条件に追加
            [latitude, longitude, id, dispatchId]
        );

        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ message: '出場記録が見つかりませんでした' }, { status: 404 });
        }

        return NextResponse.json({ message: '出場が終了しました' }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'エラーが発生しました', error: error.message }, { status: 500 });
    }
}
