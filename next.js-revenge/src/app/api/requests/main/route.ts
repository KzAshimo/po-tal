import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { supabase } from "@/lib/db"; 

const SECRET_KEY = process.env.SECRET_KEY as string;
const JWT_SECRET = process.env.JWT_SECRET || SECRET_KEY;

interface DecodedToken {
  id: number;
  username: string;
}

export async function POST(request: NextRequest) {
  try {
    const { group_name, content } = await request.json();

    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "認証エラー: トークンが見つかりません" }, { status: 401 });
    }

    let decodedToken: DecodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
      console.error("JWTエラー:", error);
      return NextResponse.json({ message: "認証エラー: トークンが無効です" }, { status: 401 });
    }

    const userId = decodedToken.id;

    if (!group_name || !content) {
      return NextResponse.json({ message: "グループ名と内容は必須です" }, { status: 400 });
    }

    const { error: insertError } = await supabase
      .from('requests')
      .insert([
        {
          user_id: userId,
          group_name: group_name,
          content: content,
        },
      ]);

    if (insertError) {
      console.error("データベースエラー:", insertError);
      return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
    }

    return NextResponse.json({ message: "データが保存されました" });
  } catch (error) {
    console.error("サーバーエラー:", error);
    return NextResponse.json({ message: "サーバーエラー" }, { status: 500 });
  }
}
