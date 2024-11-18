'use client';
import '../globals.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const Dispatch = () => {
    const [seconds, setSeconds] = useState<number>(0);
    const [username, setUsername] = useState('');
    const [modal,setModal] = useState(false);
    const router = useRouter();

    const openModal = () =>{
        setModal(true);
    }
    const closeModal = () =>{
        setModal(false);
    }
    

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds((prev) => prev + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // ユーザーデータの取得
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('トークンが見つかりません。再度ログインしてください。');
                router.push('/');
                return;
            }

            const res = await fetch('/api/user/getUsername', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (res.ok) {
                setUsername(data.username);
            } else {
                alert('エラー: ' + data.message);
                router.push('/');
            }
        };
        fetchData();
    }, [router]);

    const endDispatch = async () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                const token = localStorage.getItem('token');

                const res = await fetch('/api/dispatch/end', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        latitude,
                        longitude,
                    }),
                });

                if (res.ok) {
                    router.push(`/main`);
                } else {
                    const errorData = await res.json();
                    alert('エラー: ' + errorData.message);
                }
            });
        } else {
            alert('GPS機能をONにして下さい');
        }
    };

    const formatTime = (totalSeconds: number) => {
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        return `${hours}時間 ${minutes}分 ${secs}秒`;
    };

    return (
      <div className="flex items-center justify-center h-screen bg-cyan-50">
        <div className="w-1/2 p-8 bg-white shadow-lg rounded">
          <h1 className="text-2xl font-bold mb-4">
            <span className="text-xl px-2 font-bold underline underline-offset-4">{username}</span> さん <span className='text-red-500'>活動中</span>
          </h1>
          <h1 className="text-xl mb-4">活動時間: {formatTime(seconds)}</h1>
          <button
            onClick={openModal}
            className="w-full bg-red-500 text-white py-2 rounded hover:bg-rose-800"
          >
            活動終了
          </button>
        </div>

        {modal && ( //終了確認モーダル
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
              活動お疲れさまでした。
            </h2>
            <p>活動終了を報告してよろしいでしょうか？</p>
            <button className="bg-red-600 text-white py-2 px-4 rounded hover:bg-rose-800 m-2"
            onClick={endDispatch}>
              活動終了
            </button>
            <p>活動中であれば戻るを押してください。</p>
            <button
              className="bg-red-600 text-white py-2 px-4 rounded hover:bg-rose-700 m-2"
              onClick={closeModal}
            >
              戻る
            </button>
          </div>
        </div>
      )}


      </div>
    );


};

export default Dispatch;
