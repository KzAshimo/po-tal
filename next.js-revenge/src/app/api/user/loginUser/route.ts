import { NextResponse } from "next/server";
import { supabase } from "@/lib/db";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY as string;

export async function POST(req: Request) {
  const { username, password } = await req.json();

  try {
    const { data: userRows, error } = await supabase
      .from("users")
      .select("id, username, executive")
      .eq("username", username)
      .eq("password", password);

    if (error) {
      console.error("データベースエラー:", error);
      return NextResponse.json(
        { message: "サーバーエラー" },
        { status: 500 }
      );
    }

    if (userRows && userRows.length > 0) {
      const user = userRows[0];
      const token = jwt.sign(
        {
          id: user.id,
          username: user.username,
          executive: user.executive,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );
      return NextResponse.json({ message: "login 成功", token });
    } else {
      return NextResponse.json(
        { message: "間違いがあります" },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error("サーバーエラー:", error);
    return NextResponse.json(
      { message: "サーバーエラー" },
      { status: 500 }
    );
  }
}
