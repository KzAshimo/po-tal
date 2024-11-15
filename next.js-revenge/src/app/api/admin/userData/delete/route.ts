import { supabase } from "@/lib/db"; 
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const { data, error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    if (data?.length === 0) {
      return NextResponse.json({ message: "削除対象が見つかりません" }, { status: 404 });
    }

    return NextResponse.json({ message: "削除完了" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
