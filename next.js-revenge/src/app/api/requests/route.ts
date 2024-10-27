// src/app/api/requests/route.ts
import { NextResponse } from "next/server";
import connection from "@/lib/db";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "dan-key";

export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "トークンが見つかりません" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: number };
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json(
        { message: "ユーザーが見つかりません" },
        { status: 401 }
      );
    }

    const { group, content } = await req.json();

    // データベースへの挿入 (user_idを追加)
    const [result] = await connection.execute(
      "INSERT INTO requests (user_id, `group`, content) VALUES (?, ?, ?)",
      [userId, group, content] // userIdをここで渡す
    );

    return NextResponse.json(
      { message: "要望が保存されました", requestId: result.insertId },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "要望の保存に失敗しました" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json(
        { message: "トークンが見つかりません" },
        { status: 401 }
      );
    }

    const [rows] = await connection.execute(
      `SELECT requests.id, users.username, requests.group, requests.content,requests.status,
      requests.status, requests.created_at, requests.updated_at
    FROM requests
JOIN users ON requests.user_id = users.id`
    );
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "要望の取得に失敗" }, { status: 500 });
  }
}
