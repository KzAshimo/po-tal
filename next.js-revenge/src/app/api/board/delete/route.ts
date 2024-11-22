import { supabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm");
  const startDate = searchParams.get("startDate");
// boardテーブルから検索メソッド　フロント側で削除処理
  try {
    let query = supabase.from('board').select('*');

    if (searchTerm) {
      query = query.ilike('title', `%${searchTerm}%`).or(`ilike(content, %${searchTerm}%)`);
    }

    if (startDate) {
      const parsedStartDate = new Date(startDate);
      if (!isNaN(parsedStartDate.getTime())) {
        query = query.gte('created_at', parsedStartDate.toISOString());
      } else {
        throw new Error("Invalid date format");
      }
    }

    query = query.order('created_at', { ascending: false });

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
