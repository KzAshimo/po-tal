import { supabase } from "@/lib/db";
import jwt, { JwtPayload } from "jsonwebtoken";
import { NextResponse } from "next/server";

const SECRET_KEY = process.env.SECRET_KEY || "";
const JWT_SECRET = process.env.JWT_SECRET || SECRET_KEY;

if (!JWT_SECRET) {
    console.error("環境変数 SECRET_KEY または JWT_SECRET が設定されていません");
}

interface DecodedId extends JwtPayload {
    id: number;
}

export async function POST(req: Request) {
    try {
        // 1. トークンの取得と検証
        const token = req.headers.get("Authorization")?.split(" ")[1];
        if (!token) {
            console.error("トークンが見つかりません");
            return NextResponse.json({ message: "トークンが見つかりません" }, { status: 401 });
        }

        const decoded = jwt.verify(token, JWT_SECRET) as DecodedId;
        const userId = decoded?.id;
        if (!userId) {
            console.error("JWTデコードに失敗しました。ユーザーIDがありません。");
            return NextResponse.json({ message: "ユーザーが見つかりません" }, { status: 401 });
        }

        // 2. リクエストボディの検証
        const body = await req.json();
        console.log("リクエストボディ:", body);

        const { latitude, longitude } = body || {};
        if (
            typeof latitude !== "number" || 
            typeof longitude !== "number" || 
            isNaN(latitude) || 
            isNaN(longitude)
        ) {
            console.error("位置情報が無効です:", { latitude, longitude });
            return NextResponse.json({ message: "位置情報が無効です" }, { status: 400 });
        }

        // 3. Supabaseの更新処理
        const { data, error } = await supabase
            .from("locations")
            .update({
                end_time: new Date().toISOString(),
                end_latitude: latitude,
                end_longitude: longitude
            })
            .eq("user_id", userId)

        if (error) {
            console.error("Supabaseエラー:", {
                message: error.message,
                hint: error.hint,
                details: error.details,
            });
            return NextResponse.json(
                { message: "データ更新エラー", error: error.message },
                { status: 500 }
            );
        }


        console.log("更新成功");
        return NextResponse.json({ message: "出場終了", data }, { status: 200 });
    } catch (error) {
        console.error("エラー発生:", error);
        return NextResponse.json(
            { message: "エラーが発生しました", error: String(error) },
            { status: 500 }
        );
    }
}
