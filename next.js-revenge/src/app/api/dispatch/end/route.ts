import connection from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }) {
    const { id } = params; // or extract id from URL

    try {
        const [rows] = await connection.execute(
            `SELECT * FROM location_logs WHERE id = ?`,
            [id]
        );

        if (rows.length === 0) {
            return NextResponse.json({ message: 'Not found' }, { status: 404 });
        }

        return NextResponse.json(rows[0], { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error fetching data', error: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { id, latitude, longitude, duration } = await req.json();

        // end_timeを現在時刻で更新
        const [updateResult] = await connection.execute(
            `UPDATE location_logs SET end_time = NOW(), latitude = ?, longitude = ?, duration = ? WHERE id = ?`,
            [latitude, longitude, duration, id]
        );

        // 更新された行数をチェック
        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ message: '出場記録が見つかりませんでした' }, { status: 404 });
        }

        return NextResponse.json({ message: '出場が終了しました', result: updateResult }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'エラーが発生しました', error: error.message }, { status: 500 });
    }
}