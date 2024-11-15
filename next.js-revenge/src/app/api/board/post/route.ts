// src/app/api/dispatch/admin.ts
import { supabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm");
  const startDate = searchParams.get("startDate");

  try {
    // ベースのクエリ
    let query = supabase.from('board').select('*');

    // searchTermが指定されている場合の処理
    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`).or(`ilike(content, %${searchTerm}%)`);
    }

    // startDateが指定されている場合の処理
    if (startDate) {
      query = query.eq('created_at', startDate);
    }

    // 最新順で並び替える
    query = query.order('created_at', { ascending: false });

    // データ取得
    const { data: posts, error } = await query;

    if (error) {
      console.error('データベースエラー:', error.message);
      return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("予期しないエラー:", error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
