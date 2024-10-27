"use client";
import "../globals.css";
import { useEffect, useState } from "react";

const Admin = () => {
  // 要望データと表示状態の管理
  const [requests, setRequests] = useState([]);
  const [showRequests, setShowRequests] = useState(false);

  const fetchRequests = async() =>{
    try{
      const res = await fetch("/api/requests",{
        method:"GET",
        headers:{
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
      });
      if(res.ok){
        const data = await res.json();
        setRequests(data);
      }else{
        console.error("データの取得に失敗しました");
      }
    }catch(error){
      console.error("エラー".error);
    }
  }

  const updateStatus = async (requestId, newStatus) => {
    try {
      const res = await fetch("/api/requests", {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId, status: newStatus })
      });
      if (res.ok) {
        setRequests(requests.map(request =>
          request.id === requestId ? { ...request, status: newStatus } : request
        ));
      } else {
        console.error("ステータスの更新に失敗しました");
      }
    } catch (error) {
      console.error("エラー", error);
    }
  };

  const deleteRequest = async (requestId) => {
    try {
      const res = await fetch("/api/requests", {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId })
      });
      if (res.ok) {
        setRequests(requests.filter(requests => requests.id !== requestId));
      } else {
        console.error("要望の削除に失敗しました");
      }
    } catch (error) {
      console.error("エラー", error);
    }
  };

  useEffect(()=>{
    if(showRequests){
      fetchRequests();
    }
  },[showRequests])

  // 要望確認ボタンのクリックで表示を切り替え
  const handleShowRequests = () => {
    setShowRequests(!showRequests);
  };

  return (
    <div className="flex h-screen">
      {/* サイドバー */}
      <aside className="w-1/5 bg-zinc-950 text-white p-6 text-center">
        <h2 className="text-xl font-bold mb-6">管理者メニュー</h2>
        <ul>
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded bg-amber-600 hover:bg-amber-400"
              type="button"
            >
              団員情報
            </button>
          </li>

          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded bg-amber-600 hover:bg-amber-400"
              type="button"
            >
              出場情報
            </button>
          </li>

          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded bg-amber-600 hover:bg-amber-400"
              type="button"
              onClick={handleShowRequests}
            >
              要望確認
            </button>
          </li>

          <li>
            <button
              className="w-full text-left py-2 px-4 rounded bg-amber-600 hover:bg-amber-400"
              type="button"
            >
              掲示板
            </button>
          </li>
        </ul>
      </aside>

      {/* メインコンテンツエリア */}
      <main className="flex-1 bg-slate-200 p-8">
        <div className="flex justify-between items-center bg-white p-4 shadow-lg mb-4">
          <h1 className="text-xl">
            ようこそ <span className="font-bold underline">管理者</span> 様
          </h1>
          <button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-pink-800">
            ログアウト
          </button>
        </div>

        {/* 要望確認エリア */}
        <div className="bg-slate-100 p-6 shadow-lg rounded">
          <h2 className="text-2xl font-bold mb-4">コンテンツ表示</h2>
          <p>ここに選択されたメニューの内容が表示されます。</p>

          {/* 要望データの表示 */}
          {showRequests && (
            <div className="mt-8">
              <h3 className="text-xl font-bold mb-4">要望リスト</h3>
              <ul className="space-y-4">
                {requests.map((request) => (
                  <li
                    key={request.id}
                    className="p-4 bg-white rounded shadow-md"
                  >
                    <p className="text-gray-700">
                      <span className="font-bold">分団: </span>
                      {request.group}
                      <span className="underline underline-offset-4 p-1 mx-1 font-bold text-red-500">
                        {request.username}</span>
                    </p>
                    <p className="text-gray-700 m-2">
                      <span className="font-bold">内容: </span>
                      {request.content}
                    </p>
                    <div className="flex items-center space-x-4">
                    <button
                      className="text-sm text-blue-500 hover:underline"
                      onClick={() => updateStatus(request.id, request.status === '未読' ? '既読' : '未読')}
                    >
                      {request.status === '未読' ? '未読' : '既読'}
                    </button>
                    <button
                      className="text-sm text-red-500 hover:underline"
                      onClick={() => deleteRequest(request.id)}
                    >
                      削除
                    </button>
                  </div>                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
