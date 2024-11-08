import connection from "@/lib/db";
import { NextResponse } from "next/server";
import { RowDataPacket } from 'mysql2';

interface User extends RowDataPacket {
  id: number;
  username: string;
  executive: number;
  group: string;
}

export async function GET(){
  try{
    const [users] = await connection.execute(`
      SELECT * FROM users
      ORDER BY \`group\` ASC
      `
    );

    return NextResponse.json({users});
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
      [newExecutiveStatus,id]
    );

    const [updatedUser] = await connection.query<User[]>(
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