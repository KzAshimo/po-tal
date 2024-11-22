import { supabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        // requestのdeleteメソッド
        const { error } = await supabase
            .from('requests')
            .delete()
            .eq('request_id', id);

        if (error) {
            console.error('データベースエラー:', error.message);
            return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
        }

        return NextResponse.json({ message: "削除完了" }, { status: 200 });
    } catch (error) {
        console.error("予期しないエラー:", error);
        return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
    }
}
