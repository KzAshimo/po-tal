"use client";
import { useEffect, useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";

const Main = () => {
  const [dispatchModal, setDispatchModal] = useState(false); //出場モーダル
  const [requestModal, setRequestModal] = useState(false); //要望モーダル
  const [username,setUsername] = useState('');
  const router = useRouter();

  const openDispatchModal = () => { //出場モーダル開
    setDispatchModal(true);
  };
  const closeDispatchModal = () => { //出場モーダル閉
    setDispatchModal(false);
  };

  const openRequestModal = () =>{ //要望モーダル開
    setRequestModal(true);
  };
  const closeRequestModal = () =>{ //要望モーダル閉
    setRequestModal(false);
  };

  useEffect(() => { //ユーザーデータの取得
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
      //取得成功ならユーザーネームを取得
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

  const startDispatch = async() =>{ //災害出場
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition(async(position)=>{
        const {latitude,longitude} = position.coords;

        const res = await fetch('/api/dispatch/start',{
          method:'POST',
          headers:{
            'Content-Type':'application/json'
          },
          body:JSON.stringify({
            latitude,
            longitude
          }),
        });

        if(res.ok){
          router.push(`/dispatch`);
        }else{
          alert('エラー');
        }
      });
    }else{
      alert('GPS機能をONにして下さい');
    }
  }

  const handleLogout = () => { //ログアウト
    localStorage.removeItem('token');
    router.push('/');
  }

  return (
    <>
      <div className="flex bg-white pt-8 px-8 pb-8">
        <h1 className="mx-5 p-2">ようこそ <span className="text-xl px-2 font-bold underline underline-offset-4">{username}</span> さん</h1>
        <button className="mx-4 rounded bg-red-500 p-2 text-white hover:bg-pink-800"
        onClick={handleLogout}>
          ログアウト
        </button>
      </div>
      <div className="flex flex-wrap items-center justify-center h-screen bg-cyan-100">
        <form className="w-1/3 p-8 bg-slate-100 shadow-lg rounded mb-4 mx-3">
          <h1 className="text-2xl font-bold">出場報告</h1>
          <p className="py-2">
            災害出動前、出動後の報告を行います。
            下記ボタンクリックで時刻、位置を本部へ送信します。
          </p>
          <button
            type="button"
            className="bg-teal-500 text-white py-2 rounded mt-4 hover:bg-emerald-600 px-2"
            onClick={openDispatchModal}
          >
            災害出場画面へ
          </button>
        </form>

        <form className="w-1/3 p-8 bg-slate-100 shadow-lg rounded mb-4 mx-3">
          <h1 className="text-2xl font-bold">本部へ要望</h1>
          <p className="py-2">
            本部へ要望を行います。
            <br />
            なお、こちらの機能は幹部のみ使用可能です。
          </p>
          <button
            type="button"
            className="bg-teal-500 text-white py-2 rounded mt-4 hover:bg-emerald-600 px-1"
            onClick={openRequestModal}
          >
            要望を行う
          </button>
        </form>

        <form className="w-full p-8 bg-slate-100 shadow-lg rounded mx-5">
          <h1 className="text-2xl font-bold">掲示板</h1>
          <p>掲示板予定</p>
        </form>
      </div>

      {dispatchModal && ( //出場モーダル
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
              現在地、現時刻を送信します。
            </h2>
            <p className="mb-6">よろしいでしょうか？</p>
            <button className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-cyan-600 m-2"
            onClick={startDispatch}>
              災害出場
            </button>
            <br />
            <button
              className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-cyan-600 m-2"
              onClick={closeDispatchModal}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
      ;
      {requestModal && ( //要望モーダル
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">
              本部へ予防を送信する
            </h2>
            <p className="mb-6">よろしいでしょうか？</p>
            <form >
              <input type="text" className="border border-gray-300 rounded box-border h-32 w-full"/>
            </form>
            <button className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-cyan-600 m-2">
              要望を送信する
            </button>
            <br />
            <button
              className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-cyan-600 m-2"
              onClick={closeRequestModal}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default Main;
