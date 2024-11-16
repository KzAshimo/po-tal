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
      const parsedStartDate = new Date(startDate);
      if (!isNaN(parsedStartDate.getTime())) {
        query = query.gte('created_at', parsedStartDate.toISOString()); // 日付範囲でフィルタリング
      } else {
        throw new Error("Invalid date format");
      }
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
