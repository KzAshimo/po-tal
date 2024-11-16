import { supabase } from "@/lib/db"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('requests')
      .select(`
        *,
        users!inner(id, username, group_name)  
      `)
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    return NextResponse.json({ requests: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
