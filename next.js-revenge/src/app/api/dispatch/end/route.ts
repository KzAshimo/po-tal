import connection from "@/lib/db";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

const JWT_SECRET = process.env.JWT_SECRET || 'dan-key';

export async function POST(req: Request) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ message: 'トークンが見つかりません' }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.id;

        if (!userId) {
            return NextResponse.json({ message: 'ユーザーが見つかりません' }, { status: 401 });
        }

        // 正しいプロパティ名に修正
        const { latitude, longitude } = await req.json();

        // データベースの更新処理
        const [updateResult] = await connection.execute(
            `UPDATE location_logs 
             SET end_time = NOW(), 
                 end_latitude = ?, 
                 end_longitude = ? 
             WHERE user_id = ?`,
            [latitude, longitude, userId] 
        );

        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ message: '出動記録が見つかりませんでした' }, { status: 404 });
        }

        return NextResponse.json({ message: '出場終了' }, { status: 200 });
    } catch (error) {
        console.error('error', error);
        return NextResponse.json({ message: 'エラーが発生しました', error: error.message }, { status: 500 });
    }
}
