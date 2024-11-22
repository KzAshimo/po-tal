import { supabase } from "@/lib/db"; 
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select(`
        *,
        users(username, group_name)
      `)  
      .order('start_time', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ location: data  });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: 'データベースエラー' }, { status: 500 });
  }
}
