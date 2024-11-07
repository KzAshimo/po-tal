import connection from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchTerm = searchParams.get("searchTerm");
  const startDate = searchParams.get("startDate");

  try {
    // ベースのクエリ
    let query = "SELECT * FROM bulletin_board_posts WHERE 1=1";
    const params: (string | Date)[] = [];

    // searchTermが指定されている場合の処理
    if (searchTerm) {
      query += " AND (title LIKE ? OR content LIKE ?)";
      const keyword = `%${searchTerm}%`;
      params.push(keyword, keyword);
    }

    // startDateが指定されている場合の処理
    if (startDate) {
      query += " AND DATE(created_at) = ?";
      params.push(startDate);
    }

    // 最新順で並び替える
    query += " ORDER BY created_at DESC";

    const [posts] = await connection.query(query, params);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error("データベースエラー:", error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
