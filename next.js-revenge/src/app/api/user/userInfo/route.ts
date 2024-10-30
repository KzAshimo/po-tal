import connection from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
  try{
    const [users] = await connection.query(`
      SELECT * FROM users`
    );

    return NextResponse.json({users:users});
  }catch(error){
    console.error(error);
    return NextResponse.json({message:"データベースエラー"},{status:500})
  }
}