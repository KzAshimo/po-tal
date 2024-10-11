import { NextResponse } from "next/server";
import connection from "@/lib/db";

export async function GET(){
    try{
        const[rows] = await connection.execute('SELECT * FROM users');
        return NextResponse.json({users:rows});
    } catch(error){
        return NextResponse.json({message:'error',error},{status:500});
    }
}

export async function POST(req:Request){
    const{username,password,group} = await req.json();

    if(!username || !password || !group){
        return NextResponse.json({message:'必要事項（ユーザーネーム、パスワード、グループ）を入力してください'},{status:400});
    }

    try{
        const result = await connection.execute(
            'INSERT INTO users (username, password, `group`) VALUES (?, ?, ?)', 
      [username, password, group]
    );
    return NextResponse.json({ message: '作成完了' });
  } catch (error) {
    return NextResponse.json({ message: '作成失敗してしまいました', error }, { status: 500 });
  }
}