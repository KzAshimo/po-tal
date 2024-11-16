import { supabase } from "@/lib/db"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        users!inner(id, username, group_name)  -- usersテーブルのフィールドを選択
      `)
      .order('created_at', { ascending: false }); // created_atで降順に並べる

    if (error) {
      throw error;
    }

    return NextResponse.json({ requests: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
