"use client";
import { useEffect, useState } from "react";
import "../globals.css";

const Admin = () => {
  const [data, setData] = useState({ requests: [], users: [] });
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState(""); // 表示するコンテンツを制御する状態

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("api/requests/admin");

        if (!response.ok) {
          throw new Error("データ取得エラー");
        }
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };
    fetchData();
  }, []);

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
              onClick={() => setSelectedContent("users")} // 団員情報ボタン
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
              onClick={() => setSelectedContent("requests")} // 要望確認ボタン
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

          {/* エラーがある場合の表示 */}
          {error && <p className="text-red-500">エラー: {error}</p>}

          {/* 団員情報と要望確認の切り替え表示 */}
          {selectedContent === "requests" && (
            <div>
              <h3 className="text-lg font-semibold">要望確認</h3>
              <ul>
                {data.requests.map((request) => (
                  <li key={request.id} className="p-2 bg-gray-200 mb-2 rounded">
                    要望者:{request.username}
                    <br />
                     {request.group} 分団
                    <br />
                    要望: {request.content}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedContent === "users" && (
            <div>
              <h3 className="text-lg font-semibold">Users</h3>
              <ul>
                {data.users.map((user) => (
                  <li key={user.id} className="p-2 bg-gray-200 mb-2 rounded">
                    {user.group}
                    {user.username}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {!selectedContent && (
            <p>ここに選択されたメニューの内容が表示されます。</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
