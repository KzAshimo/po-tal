import { supabase } from "@/lib/db"; // Supabaseクライアントをインポート
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, executive } = await req.json();

    // Supabaseでユーザーのexecutiveを更新
    const { data, error } = await supabase
      .from("users")
      .update({ executive })
      .eq("id", id);

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
    }

    if (data?.length === 0) {
      return NextResponse.json({ message: "エラー" }, { status: 500 });
    }

    return NextResponse.json({ message: "成功" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
