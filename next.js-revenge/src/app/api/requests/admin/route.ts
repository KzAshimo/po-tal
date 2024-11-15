import { supabase } from "@/lib/db"; 
import { NextResponse } from "next/server";

// データベース読み込み(requestsテーブル、usersテーブル)
export async function GET() {
  try {
    // requestsテーブルとusersテーブルを内部結合してデータを取得
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        users!inner(id, username, group_name)  -- usersテーブルのフィールドを選択
      `)
      .order('created_at', { ascending: false }); // created_atで降順に並べる

    // エラーがあった場合
    if (error) {
      throw error;
    }

    // レスポンスとしてrequestsデータを返す
    return NextResponse.json({ requests: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
