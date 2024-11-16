import { supabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { title, content } = await req.json();

  try {
    const { data, error } = await supabase
      .from('board')
      .insert([
        { title, content }
      ])

    // エラーチェック
    if (error) {
      console.error('データベースエラー:', error.message);
      return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
    }

    // 成功レスポンス: 挿入されたデータを返す
    return NextResponse.json({ message: "投稿が作成されました", data });
  } catch (error) {
    console.error('予期しないエラー:', error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
