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

interface ToggleExecutiveRequest {
  id: number;
  executive: number;
}

export async function POST(request:Request){
  try{
    const {id,executive}:ToggleExecutiveRequest = await request.json();
    const newExecutiveStatus = executive === 1 ? 0 : 1;

    await connection.query(
      `UPDATE users SET executive = ? WHERE id = ?`,
      [id]
    );

    const [updatedUser] = await connection.query(
      `SELECT * FROM users WHERE id = ?`,
      [id]
    );

    return NextResponse.json(updatedUser[0]);
  }catch(error){
    console.error(error);
    return NextResponse.json(
      { message: "データベースエラー" },
      { status: 500 }    )
  }
}