import connection from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req:Request){
    try{
    const {id,executive} = await req.json();

    const [updateResult] = await connection.execute(
        `UPDATE users
        SET executive = ?
        WHERE id = ?`,
        [executive,id]
    );

    if((updateResult as any).affectedRows === 0){
        return NextResponse.json({message:"エラー"},{status:500});
    }
    return NextResponse.json({message:"成功"},{status:200});
}catch(error){
    console.error(error);
    return NextResponse.json({message:"データベースエラー"},{status:500});
}
}