"use client";
import { useEffect, useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";

const Admin = () => {
  const [data, setData] = useState({ requests: [], users: [] });
  const [error, setError] = useState(null);
  const [selectedContent, setSelectedContent] = useState(""); // 表示するコンテンツを制御

  const router = useRouter();

  // ログアウト
  const handleLogout = async () => {
    try {
      const response = await fetch("api/admin/logout", {
        method: "POST",
      });

      if (response.ok) {
        router.replace("/");
      } else {
        console.error("ログアウトエラー");
      }
    } catch (error) {
      console.error("ログアウトエラー");
    }
  };

  // 要望確認データの取得
  useEffect(() => {
    const fetchRequestsData = async () => {
      try {
        const response = await fetch("api/requests/admin");

        if (!response.ok) {
          throw new Error("データ取得エラー");
        }
        const result = await response.json();
        setData((prevData) => ({ ...prevData, requests: result.requests }));
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };
    fetchRequestsData();
  }, []);

  // 団員情報データの取得
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await fetch("/api/user/userInfo");

        if (!response.ok) {
          throw new Error("ユーザー情報取得エラー");
        }
        const result = await response.json();
        setData((prevData) => ({ ...prevData, users: result.users }));
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };
    fetchUsersData();
  }, []);

  // 出場消防データの取得
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch("/api/dispatch/admin");

        if (!response.ok) {
          throw new Error("出場情報取得エラー");
        }
        const result = await response.json();
        setData((prevData) => ({ ...prevData, location: result.location }));
      } catch (error) {
        console.error(error);
        setError(error.message);
      }
    };
    fetchLocationData();
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
              onClick={() => setSelectedContent("location")} // 出場情報ボタン
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
          <button
            className="rounded bg-red-500 px-4 py-2 text-white hover:bg-pink-800"
            onClick={handleLogout}
          >
            ログアウト
          </button>
        </div>

        <div className="bg-slate-100 p-6 shadow-lg rounded">
          <h2 className="text-2xl font-bold mb-4">コンテンツ表示</h2>

          {/* エラーがある場合の表示 */}
          {error && <p className="text-red-500">エラー: {error}</p>}

          {/* 団員情報*/}
          {selectedContent === "users" && (
            <div>
              <h3 className="text-lg font-semibold">団員情報</h3>
              <button
                className="w-sm text-left py-2 px-4 rounded bg-slate-600 hover:bg-slate-300 text-white my-3"
                onClick={() => setSelectedContent("")}
              >
                閉じる
              </button>

              <ul>
                {data.users.map((user) => (
                  <li key={user.id} className="p-2 bg-gray-200 mb-2 rounded">
                    {user.group} 分団: {user.username}
                    {""} {user.executive === 1 ? "【幹部】" : ""}

                    
                    
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* 出場情報*/}
          {selectedContent === "location" && (
            <div>
              <h3 className="text-lg font-semibold">出場情報</h3>
              <button
                className="w-sm text-left py-2 px-4 rounded bg-slate-600 hover:bg-slate-300 text-white my-3"
                onClick={() => setSelectedContent("")}
              >
                閉じる
              </button>
              <ul>
                {data.location.map((log) => {
                  // 秒数を時間と分に変換
                  const hours = Math.floor(log.duration / 3600); // 1時間 = 3600秒
                  const minutes = Math.floor((log.duration % 3600) / 60); // 1分 = 60秒

                  return (
                    <li key={log.id} className="p-2 bg-gray-200 mb-2 rounded">
                      出場者: {log.username} 【{log.group}分団】活動時間:{" "}
                      {hours}時間 {minutes}分
                      <br />
                      開始報告日時:
                      {new Date(log.start_time).toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                      <br />
                      開始報告地点:【緯度】{log.start_latitude}【経度】
                      {log.start_longitude}
                      <br />
                      終了報告日時:
                      {new Date(log.end_time).toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                      <br />
                      終了報告地点:【緯度】{log.end_latitude}【経度】
                      {log.end_longitude}
                    </li>
                  );
                })}{" "}
              </ul>
            </div>
          )}

          {/* 要望確認*/}
          {selectedContent === "requests" && (
            <div>
              <h3 className="text-lg font-semibold">要望確認</h3>
              <button
                className="w-sm text-left py-2 px-4 rounded bg-slate-600 hover:bg-slate-300 text-white my-3"
                onClick={() => setSelectedContent("")}
              >
                閉じる
              </button>
              <ul>
                {data.requests.map((request) => (
                  <li key={request.id} className="p-2 bg-gray-200 mb-2 rounded">
                    {new Date(request.created_at).toLocaleString("ja-JP", {
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}{" "}
                    <br />
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
          {!selectedContent && (
            <p>ここに選択されたメニューの内容が表示されます。</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default Admin;
