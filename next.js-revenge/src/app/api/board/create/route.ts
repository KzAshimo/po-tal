import connection from "@/lib/db";
import { NextResponse } from "next/server";
export async function POST(req:Request){
  const {title,content} = await req.json();
  try{
    await connection.query("INSERT INTO bulletin_board_posts(title,content) VALUE(?,?)",[
      title,
      content,
    ]);
    return NextResponse.json({message:"投稿が作成されました"});
  }catch(error){
    console.error(error);
    return NextResponse.json({message:"データベースエラー"},{status:500});
  }
}