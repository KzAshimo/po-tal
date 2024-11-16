import { supabase } from "@/lib/db"; 
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
  try {
    const { id } = await req.json();

    const {  error } = await supabase
      .from("users")
      .delete()
      .eq("id", id);

    if (error) {
      throw error;
    }

    return NextResponse.json({ message: "削除完了" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
