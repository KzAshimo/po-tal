import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET_KEY = 'dan-key';

export async function GET(req:Request){
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

if(!token){
    return NextResponse.json({message:'トークンが提供されてない'},{status:403});
}
try{
    //トークンを検証
    const decoded = jwt.verify(token,SECRET_KEY) as {userId:number};

    const userId = decoded.userId;

    //成功時にユーザー名を返す
    return NextResponse.json({userId});
}catch(error){
    console.error(error);
    return NextResponse.json({message:'無効なトークン'},{status:403});

}};