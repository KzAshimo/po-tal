import { supabase } from "@/lib/db";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
      const { id } = await req.json();
      console.log("Received id:", id); // ここで id をログに出力
  
      // idがundefinedまたはnullの場合、エラーレスポンスを返す
      if (!id) {
        return NextResponse.json({ message: "IDが無効です" }, { status: 400 });
      }
  
      const { data, error } = await supabase
        .from('board')
        .delete()
        .eq('board_id', id);
  
      if (error) {
        console.error("Supabase error:", error);
        return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
      }
  
      return NextResponse.json({ message: "削除完了" }, { status: 200 });
    } catch (error) {
      console.error("データベースエラー:", error);
      return NextResponse.json({ message: "リクエストエラー" }, { status: 400 });
    }
  }
  