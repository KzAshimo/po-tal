import jwt,{JwtPayload} from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const SECRET_KEY = process.env.SECRET_KEY as string;

interface MyJwtPayload extends JwtPayload{
    userId:number;
}

export async function GET(req:Request){
    const authHeader = req.headers.get('Authorization');
    const token = authHeader?.split(' ')[1];

if(!token){
    return NextResponse.json({message:'トークンが提供されてない'},{status:403});
}
try{
    const decoded = jwt.verify(token,SECRET_KEY) as MyJwtPayload | JwtPayload;

    const userId = decoded.userId;

    return NextResponse.json({userId});
}catch(error){
    console.error(error);
    return NextResponse.json({message:'無効なトークン'},{status:403});

}};