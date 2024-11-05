import connection from "@/lib/db";
import { NextResponse } from "next/server";
import { OkPacket } from 'mysql2';

export async function POST(req: Request) {
    try {
        const { id, status } = await req.json();

        const [updateResult] = await connection.execute<OkPacket>(
            `UPDATE requests SET status = ? WHERE request_id = ?`,
            [status, id]
        );

        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ message: "更新対象が存在しません" }, { status: 404 });
        }

        return NextResponse.json({ message: "成功" }, { status: 200 });
    } catch (error) {
        console.error("データベースエラー:", error);
        return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
    }
}
