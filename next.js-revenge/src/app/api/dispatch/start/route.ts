import { supabase } from "@/lib/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY as string;
const JWT_SECRET = process.env.JWT_SECRET || SECRET_KEY;


export async function POST(req: Request) {
  try {
    const token = req.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "トークンが見つかりません" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    const userId = decoded.id;

    if (!userId) {
      return NextResponse.json(
        { message: "ユーザーが見つかりません" },
        { status: 401 }
      );
    }

    const { latitude, longitude } = await req.json();

    const { data, error } = await supabase
      .from("locations") 
      .insert({
        user_id: userId,
        start_latitude: latitude,
        start_longitude: longitude,
        start_time: new Date().toISOString(),
      })
      .select(); 

    if (error) {
      console.error("Supabaseエラー", error);
      return NextResponse.json(
        { message: "データ挿入エラー", error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "出場開始", id: data?.[0]?.id },
      { status: 200 }
    );
  } catch (error) {
    console.error("エラー", error);
    return NextResponse.json(
      { message: "エラーが発生しました", error },
      { status: 500 }
    );
  }
}
