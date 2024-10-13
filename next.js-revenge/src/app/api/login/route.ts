import { NextResponse } from "next/server";
import mysql from 'mysql2/promise'

export async function POST(req:Request){
    const{username,password} = await req.json();

    try{
        const connection = await mysql.createConnection({
            host:'127.0.0.1',
            user:'root',
            password:'',
            database:'db_login'
        });

        const [rows] = await connection.execute(
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