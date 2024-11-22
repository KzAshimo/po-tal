import { supabase } from "@/lib/db"; 
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { id, executive } = await req.json();

    // userdata executiveのupdate
    const { error } = await supabase
      .from("users")
      .update({ executive })
      .eq("id", id);

    if (error) {
      console.error(error);
      return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
    }


    return NextResponse.json({ message: "成功" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
