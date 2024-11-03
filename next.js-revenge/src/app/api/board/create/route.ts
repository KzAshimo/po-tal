import connection from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        // リクエストボディのデータをJSONとして取得
        const { id, executive } = await req.json();

        const [updateResult] = await connection.execute(
            `UPDATE users SET executive = ? WHERE id = ?`,
            [executive, id]
        );

        // 更新が成功したかを確認
        if (updateResult.affectedRows === 0) {
            return NextResponse.json({ message: "エラー" }, { status: 500 });
        }

        return NextResponse.json({ message: "更新完了" }, { status: 200 });
    } catch (error) {
        console.error("サーバーエラー:", error);
        return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
    }
}
