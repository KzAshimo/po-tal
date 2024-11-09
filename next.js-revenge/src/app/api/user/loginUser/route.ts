import { NextResponse } from "next/server";
import connection from "@/lib/db";
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY as string;


export async function POST(req:Request){
    const{username,password} = await req.json();

    //データベースからユーザーを取得
    try{ const [rows] = await connection.execute(
            `SELECT * FROM users WHERE username = ? AND password = ?`,
            [username,password]
        );

        const userRows = rows as { id: number; username: string; executive: string }[];

        if(userRows.length > 0){
            const user = userRows[0];
            //jwtトークンを生成
            const token = jwt.sign({
                id:user.id,
                username:user.username,
                executive:user.executive,
            },
            SECRET_KEY,
            {expiresIn:'1h'}
            );
            //トークンを返す
            return NextResponse.json({message:'login 成功',token});
        }else{
            return NextResponse.json(
                {message:'間違いがあります'},
                {status:401}
            );
        }
    }catch (error){
        console.error(error)
        return NextResponse.json(
            {message:'サーバーエラー'},
            {status:500}

        );
    }
}
