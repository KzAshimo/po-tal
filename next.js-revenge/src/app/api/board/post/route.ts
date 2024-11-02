import connection from "@/lib/db";
import { error } from "console";
import { NextResponse } from "next/server";


export async function GET(){
    try{
        const [posts] = await connection.query("SELECT * FROM bulletin_board_posts ORDER BY created_at DESC");
        return NextResponse.json({posts});
    }catch{
        console.error(error);
        return NextResponse.json({message:"データベースエラー"},{status:500});
    }
}