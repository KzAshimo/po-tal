import { supabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm");
  const startDate = searchParams.get("startDate");

  // 掲示板投稿
  try {
    let query = supabase.from("board").select("*");

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }

    if (startDate) {
      const startOfDay = `${startDate}T00:00:00`;
      const endOfDay = `${startDate}T23:59:59`;
      query = query.gte("created_at", startOfDay).lte("created_at", endOfDay);
    }

    query = query.order("created_at", { ascending: false });

    const { data: posts, error } = await query;

    if (error) {
      console.error("データベースエラー:", error.message);
      return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
    }

    return NextResponse.json({ posts });
  } catch (error) {
    console.error("予期しないエラー:", error);
    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
}
