import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connection from "@/lib/db";

const SECRET_KEY = process.env.SECRET_KEY as string;
// JWTのシークレットキー
const JWT_SECRET = process.env.JWT_SECRET || SECRET_KEY;

interface DecodedToken {
  id: number;
  username: string;
}

export async function POST(request: NextRequest) {
  try {
    // リクエストのJSONボディを取得
    const { group, content } = await request.json();

    // リクエストヘッダーからトークンを取得
    const authHeader = request.headers.get("authorization");
    const token = authHeader?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "認証エラー: トークンが見つかりません" }, { status: 401 });
    }

    // トークンを検証してユーザーIDを取得
    let decodedToken: DecodedToken;
    try {
      decodedToken = jwt.verify(token, JWT_SECRET) as DecodedToken;
    } catch (error) {
      console.error("JWTエラー:", error);
      return NextResponse.json({ message: "認証エラー: トークンが無効です" }, { status: 401 });
    }

    const userId = decodedToken.id;

    //ユーザーが幹部か確認
    const [result] = await connection.query("SELECT executive FROM users WHERE id = ?",[userId]);

    const executiveResult = result as { executive: number }[];
    const isExecutive = executiveResult[0]?.executive === 1;
    if(!isExecutive){
      return NextResponse.json({message:"幹部のみの機能です"},{status:403});
    }

    // 必須フィールドのチェック
    if (!group || !content) {
      return NextResponse.json({ message: "グループと内容は必須です" }, { status: 400 });
    }

    // データベースへの挿入クエリ
    const query = "INSERT INTO requests (user_id, `group`, content, status) VALUES (?, ?, ?, '未対応')";
    const values = [userId, group, content];

    await connection.query(query, values);

    return NextResponse.json({ message: "データが保存されました" });
  } catch (error) {
    console.error("データベースエラー:", error);
    return NextResponse.json({ message: "データベースエラー" }, { status: 500 });
  }
}
