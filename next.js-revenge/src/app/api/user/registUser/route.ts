import { NextResponse } from "next/server";
import { supabase } from '@/lib/db'

// GETリクエスト処理
export async function GET() {
  try {
    // Supabaseを使ってデータを取得
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

// POSTリクエスト処理（新しいユーザー作成）
export async function POST(req: Request) {
  try {
    // リクエストボディからデータを取得
    const { username, password, group_name } = await req.json();

    // 必須フィールドの確認
    if (!username || !password || !group_name) {
      return NextResponse.json(
        { message: 'ユーザーネーム、パスワード、グループIDはすべて必須です' },
        { status: 400 }
      );
    }

    // Supabaseを使って新しいユーザーを挿入
    const { error } = await supabase
      .from("users")
      .insert([{ username, password, group_name }]);  // 修正: group_id に変更

    if (error) {
      console.error('Error creating user:', error);
      return NextResponse.json({ message: 'ユーザー作成に失敗しました', error }, { status: 500 });
    }

    // 成功レスポンス
    return NextResponse.json({ message: 'ユーザー作成が完了しました' });
  } catch (error) {
    console.error('Failed to create user:', error);
    return NextResponse.json({ message: 'ユーザー作成に失敗しました', error }, { status: 500 });
  }
}
