import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const {password } = body;

        const adminPass = 'admin';

        if (password === adminPass) {
            return NextResponse.json({ message: 'ログイン成功' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'エラー' }, { status: 401 });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'サーバーエラー' }, { status: 500 });
    }
}
