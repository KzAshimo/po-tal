import { supabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json({ message: "IDが提供されていません" }, { status: 400 });
    }

    const { error } = await supabase.from("board").delete().eq("board_id", id);
    if (error) {
      console.error("データ削除エラー:", error.message);
      return NextResponse.json({ message: "削除エラー" }, { status: 500 });
    }

    return NextResponse.json({ message: "削除成功" }, { status: 200 });
  } catch (error) {
    console.error("予期しないエラー:", error);
    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
}
