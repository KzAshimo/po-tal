// api/test/route.ts
import { NextResponse } from 'next/server'
import { supabase } from '@/lib/db'

export const GET = async () => {
  try {
    const { data, error } = await supabase
      .from('users')  // ここを変更
      .select('*')
      

    if (error) {
      console.error('Supabase Error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (err) {
    console.error('Error:', err)
    return NextResponse.json({ error: 'Error fetching data' }, { status: 500 })
  }
}
