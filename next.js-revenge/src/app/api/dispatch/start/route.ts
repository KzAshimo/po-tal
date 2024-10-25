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

        // データベースへの挿入
        const [result] = await connection.execute(
            `INSERT INTO location_logs (user_id, start_latitude, start_longitude, start_time) VALUES (?, ?, ?, NOW())`,
            [userId, latitude, longitude] // 修正されたプロパティ名を使用
        );

        const insertId = result.insertId;

        return NextResponse.json({ message: '出場開始', id: insertId }, { status: 200 });
    } catch (error) {
        console.error('error', error); // エラーログを詳細に記録
        return NextResponse.json({ message: 'エラー', error: error.message }, { status: 500 });
    }
}
