import { supabase } from "@/lib/db"; 
import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Supabaseでユーザー情報を取得
    const { data: users, error } = await supabase
      .from("users")
      .select("*")
      .order("group_name", { ascending: true });

    if (error) {
      throw error;
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}

interface ToggleExecutiveRequest {
  id: number;
  executive: number;
}

export async function POST(request: Request) {
  try {
    const { id, executive }: ToggleExecutiveRequest = await request.json();
    const newExecutiveStatus = executive === 1 ? 0 : 1;

    // Supabaseでユーザーのexecutiveステータスを更新
    const { data, error } = await supabase
      .from("users")
      .update({ executive: newExecutiveStatus })
      .eq("id", id)
      .single(); // 単一のユーザーのみ更新

    if (error) {
      throw error;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
