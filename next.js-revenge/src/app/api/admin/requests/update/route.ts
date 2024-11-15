// src/app/api/dispatch/admin.ts
import { supabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { id, status } = await req.json();

        // Supabaseを使ってrequestsテーブルのstatusを更新
        const { data, error } = await supabase
            .from('requests')
            .update({ status })
            .eq('request_id', id);

        if (error) {
            console.error('データベースエラー:', error.message);
            return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
        }

        if (data?.length === 0) {
            return NextResponse.json({ message: "更新対象が存在しません" }, { status: 404 });
        }

        return NextResponse.json({ message: "成功" }, { status: 200 });
    } catch (error) {
        console.error("予期しないエラー:", error);
        return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
    }
}
