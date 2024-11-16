import { supabase } from "@/lib/db"; 
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // locationsテーブルとusersテーブルのリレーションを使用してデータを取得
    const { data, error } = await supabase
      .from('locations')
      .select(`
        *,
        users:users(username, group_name)  // usersテーブルのusernameとgroup_nameを取得
      `)  
      .order('start_time', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ location: data });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'データベースエラー' }, { status: 500 });
  }
}
