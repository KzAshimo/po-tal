import { NextResponse } from "next/server";
import { supabase } from '@/lib/db'

export async function GET() {
  try {
    const { data: users, error } = await supabase.from("users").select("*");

    if (error) {
      console.error("Supabase Error:", error);
      return NextResponse.json({ message: "データ取得に失敗しました", error }, { status: 500 });
    }

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ message: 'エラーが発生しました', error }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { username, password, group_name } = await req.json();

    if (!username || !password || !group_name) {
      return NextResponse.json(
        { message: 'ユーザーネーム、パスワード、グループIDはすべて必須です' },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("users")
      .insert([{ username, password, group_name }]);  // 修正: group_id に変更

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ message: 'ユーザー作成に失敗しました', error }, { status: 500 });
    }

    return NextResponse.json({ message: 'ユーザー作成が完了しました' });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ message: 'ユーザー作成に失敗しました', error }, { status: 500 });
  }
}
