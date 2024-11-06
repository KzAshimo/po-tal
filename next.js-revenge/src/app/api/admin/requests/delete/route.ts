import connection from "@/lib/db";
import { NextResponse } from "next/server";
import { OkPacket } from 'mysql2';

export async function DELETE (req:Request){
    try{
        const {id} = await req.json();

        const [deleteResult] = await connection.execute<OkPacket>(
            `DELETE FROM requests WHERE request_id = ?`,
            [id]
        );

        if(deleteResult.affectedRows === 0){
            return NextResponse.json({message:"削除対象が見つかりません"},{status:404});
        }

        return NextResponse.json({message:"削除完了"},{status:200});
    }catch(error){
        console.error(error);
        return NextResponse.json({message:"データベースエラー"},{status:500});
    }
}