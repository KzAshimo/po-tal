// src/app/api/dispatch/admin.ts
import { supabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();

        // Supabaseを使ってrequestsテーブルから指定したrequest_idを削除
        const { data, error } = await supabase
            .from('requests')
            .delete()
            .eq('request_id', id);

        if (error) {
            console.error('データベースエラー:', error.message);
            return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
        }

        if (data?.length === 0) {
            return NextResponse.json({ message: "削除対象が見つかりません" }, { status: 404 });
        }

        return NextResponse.json({ message: "削除完了" }, { status: 200 });
    } catch (error) {
        console.error("予期しないエラー:", error);
        return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
    }
}
