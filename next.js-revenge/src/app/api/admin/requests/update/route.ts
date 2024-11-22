import { supabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { id, status } = await req.json();

        // request statusのupdateメソッド
        const { error } = await supabase
            .from('requests')
            .update({ status })
            .eq('request_id', id);

        if (error) {
            console.error('データベースエラー:', error.message);
            return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
        }


        return NextResponse.json({ message: "成功" }, { status: 200 });
    } catch (error) {
        console.error("予期しないエラー:", error);
        return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
    }
}
