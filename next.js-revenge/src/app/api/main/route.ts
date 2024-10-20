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
    const decoded = jwt.verify(token,SECRET_KEY) as {username:string};

    const username = decoded.username;

    //成功時にユーザー名を返す
    return NextResponse.json({username});
}catch(error){
    return NextResponse.json({message:'無効なトークン'},{status:403});

}}

export async function POST(req:Request){
    const {username,password} = await req.json();

    if(username === 'amuro' && password === 'ray'){
        const token = jwt.sign({username},SECRET_KEY,{expiresIn:'1h'});
        
        return NextResponse.json({message:'ログイン成功',token})
    }else{
        return NextResponse.json({message:'認証失敗',status:401});
    }
}