'use client';
import '../globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dispatch = () => {
    const [seconds, setSeconds] = useState<number>(0);
    const [dispatchId, setDispatchId] = useState<number | null>(null);
    const router = useRouter();

    // タイマー用の useEffect
    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // ローカルストレージから dispatchId を取得
    useEffect(() => {
        const savedId = localStorage.getItem('dispatchId');
        if (savedId) {
            setDispatchId(parseInt(savedId, 10));
        }
    }, []);

    // 出場終了ボタンの処理
    const endDispatch = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;

                // dispatchId が取得できているか確認
                if (!dispatchId) {
                    alert("dispatchId が存在しません。");
                    return;
                }

                const token = localStorage.getItem('token'); // ローカルストレージからトークンを取得
                if (!token) {
                    alert("トークンが存在しません。再度ログインしてください。");
                    return;
                }

                // リクエスト送信
                const res = await fetch(`/api/dispatch/end`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` // トークンをヘッダーに含める
                    },
                    body: JSON.stringify({
                        id: dispatchId,
                        latitude,
                        longitude,
                        duration: seconds,
                    })
                });

                // レスポンス確認
                if (res.ok) {
                    alert('終了しました');
                    router.push('/main');
                } else {
                    const errorData = await res.json();
                    alert(`エラーが発生しました: ${errorData.message}`);
                }
            });
        } else {
            alert('GPS機能をONにして下さい');
        }
    };

    return (
        <div className="container">
            <h1>タイマー: {seconds} 秒</h1>
            <button
                onClick={endDispatch}
                className="bg-red-500 text-white py-2 px-4 rounded"
            >
                出場終了
            </button>
        </div>
    );
};

export default Dispatch;
