import connection from "@/lib/db";
import { NextResponse } from "next/server";

//データベース読み込み(requestsテーブル、usersテーブル)
export async function GET(){
  try{
    const [requestUsers] = await connection.query(`
      SELECT * FROM requests
      JOIN users ON requests.user_id = users.id`
    );

    return NextResponse.json({requests:requestUsers});
  }catch(error){
    console.error(error);
    return NextResponse.json({message:"データベースエラー"},{status:500})
  }
}