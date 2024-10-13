import { NextResponse } from "next/server";
import connection from "@/lib/db";

export async function POST(req:Request){
    const{username,password} = await req.json();

    try{ const [rows] = await connection.execute(
            `SELECT * FROM users WHERE username = ? AND password = ?`,
            [username,password]
        );

        if(rows.length > 0){
            return NextResponse.json({message:'login 成功'});
        }else{
            return NextResponse.json(
                {message:'間違いがあります'},
                {status:401}
            );
        }
    }catch (error){
        return NextResponse.json(
            {message:'サーバーエラー'},
            {status:500}

        );
    }
}