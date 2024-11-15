import { createClient, SupabaseClient } from '@supabase/supabase-js';

// クライアント用の公開URLと公開APIキーを取得
const supabaseUrl: string = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseKey: string = process.env.NEXT_PUBLIC_SUPABASE_KEY as string;

if (!supabaseUrl || !supabaseKey) {
  console.error('Supabase URL or Key is missing');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);