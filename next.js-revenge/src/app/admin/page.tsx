"use client";
import { useEffect, useState } from "react";
import "../globals.css";
import { useRouter } from "next/navigation";

// 新しいコンポーネントをインポート
import AdminPostForm from "../components/adminPostForm";
import BulletinBoard from "../components/bulletinBoard";

type UserType = {
  id: number;
  username: string;
  group: string;
  executive: number;
};

const Admin = () => {
  const [data, setData] = useState<{
    requests: Array<{
      request_id: number;
      created_at: string;
      username: string;
      group: string;
      content: string;
      status: number;
    }>;
    users: UserType[];
    location: Array<{
      id: number;
      username: string;
      group: string;
      start_time: string;
      end_time: string;
      start_latitude: number;
      start_longitude: number;
      end_latitude: number;
      end_longitude: number;
      duration: number;
    }>;
  }>({ requests: [], users: [], location: [] });
  const [error, setError] = useState<string | null>(null);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState(""); // 検索クエリ状態追加
  const [isShowingCompleted, setIsShowingCompleted] = useState(false);

  const [startDate, setStartDate] = useState(""); // 開始日
  const [endDate, setEndDate] = useState(""); // 終了日
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch("api/admin/logout", { method: "POST" });
      if (response.ok) router.replace("/");
      else console.error("ログアウトエラー");
    } catch (error) {
      setError((error as Error).message);
    }
  };
  //--以下団情報--------------------------------------------------
  // 団員情報データの取得
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const response = await fetch("/api/user/userInfo");
        if (!response.ok) throw new Error("ユーザー情報取得エラー");
        const result = await response.json();
        setData((prevData) => ({ ...prevData, users: result.users }));
      } catch (error) {
        console.error(error);
        setError((error as Error).message);
      }
    };
    fetchUsersData();
  }, []);

  // 幹部切り替え
  const toggleExecutive = async (userId: number, currentExecutive: number) => {
    const newExecutive = currentExecutive === 1 ? 0 : 1;

    try {
      const res = await fetch("/api/admin/userData/executiveUpdate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: userId, executive: newExecutive }),
      });

      const data = await res.json();
      if (res.ok) {
        // 成功した場合、該当ユーザーのexecutiveステータスを更新
        setData((prevData) => ({
          ...prevData,
          users: prevData.users.map((user) =>
            user.id === userId ? { ...user, executive: newExecutive } : user
          ),
        }));
        alert("幹部情報を更新しました");
      } else {
        alert(`エラー: ${data.message}`);
      }
    } catch (error) {
      console.error("エラーが発生しました:", error);
    }
  };

  //ユーザーデータ削除
  const deleteUser = async (id: number) => {
    try {
      const res = await fetch("/api/admin/userData/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`削除エラー: ${errorData.message}`);
        return;
      }

      const data = await res.json();
      alert(data.message); // 削除完了メッセージ

      // データ更新処理（削除したユーザーを除外）
      setData((prevData) => ({
        ...prevData,
        users: prevData.users.filter((user) => user.id !== id),
      }));
    } catch (error) {
      setError((error as Error).message);
    }
  };
  //--以上団員情報-----------------------------------------

  //--以下出場情報-----------------------------------------
  // 出場消防データの取得
  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch("/api/dispatch/admin");
        if (!response.ok) throw new Error("出場情報取得エラー");
        const result = await response.json();
        setData((prevData) => ({ ...prevData, location: result.location }));
      } catch (error) {
        setError((error as Error).message);      }
    };
    fetchLocationData();
  }, []);
  //--以上出場情報----------------------------------------------

  //--以下要望確認--------------------------------------------
  // 要望確認データの取得
  useEffect(() => {
    const fetchRequestsData = async () => {
      try {
        const response = await fetch("/api/requests/admin");
        if (!response.ok) throw new Error("データ取得エラー");
        const result = await response.json();
        setData((prevData) => ({ ...prevData, requests: result.requests }));
      } catch (error) {
        console.error(error);
        setError((error as Error).message);      }
    };
    fetchRequestsData();
  }, []);

  //要望status切り替え
  const toggleStatus = async (id: number, status: number) => {
    const newStatus = status === 1 ? 0 : 1;
    try {
      const res = await fetch("/api/admin/requests/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });
      const data = await res.json();

      if (res.ok) {
        setData((prevData) => ({
          ...prevData,
          requests: prevData.requests.map((request) =>
            request.request_id === id
              ? { ...request, status: newStatus }
              : request
          ),
        }));
      } else {
        alert(data.message || "ステータス更新エラー");
      }
    } catch (error) {
      console.error("ステータス更新エラー:", error);
      alert("ステータス更新エラー");
    }
  };

  //要望削除
  const deleteRequests = async (id: number) => {
    try {
      const res = await fetch("/api/admin/requests/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`削除エラー: ${errorData.message}`);
        return;
      }

      const data = await res.json();
      alert(data.message); // 削除完了メッセージ

      setData((prevData) => ({
        ...prevData,
        requests: prevData.requests.filter(
          (request) => request.request_id !== id
        ),
      }));
    } catch (error) {
      console.error("削除エラー:", error);
      alert("削除中にエラーが発生しました");
    }
  };
  //--以上要望確認----------------------------------------------------

  const handleSearch = (e:React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value.toLowerCase());

  //--検索-------------------------------------------------------------
  //ユーザー情報
  const filteredUsers = data.users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery) ||
      (user.group && user.group.toString().toLowerCase().includes(searchQuery))
  );
  //出場情報
  const filteredLocations = data.location.filter((log) => {
    const matchesSearchQuery =
      log.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.group && log.group.toString().toLowerCase().includes(searchQuery));

    const logStartDate = new Date(log.start_time);
    const logEndDate = new Date(log.end_time);
    const selectedStartDate = startDate ? new Date(startDate) : null;
    const selectedEndDate = endDate ? new Date(endDate) : null;

    const matchesDateRange =
      (!selectedStartDate || logStartDate >= selectedStartDate) &&
      (!selectedEndDate || logEndDate <= selectedEndDate);

    return matchesSearchQuery && matchesDateRange;
  });
  const resetDates = () => {
    setStartDate("");
    setEndDate("");
  };
  //要望情報
  const filteredRequests = data.requests.filter((request) => {
    const matchesSearchQuery =
      request.username.toLowerCase().includes(searchQuery) ||
      (request.group &&
        request.group.toString().toLowerCase().includes(searchQuery)) ||
      request.content.toLowerCase().includes(searchQuery); // 要望内容を検索

    // 日付フィルタリング（開始日以降）
    const createdAt = new Date(request.created_at);
    const isAfterStartDate = !startDate || createdAt >= new Date(startDate);

    // 両方の条件を満たす場合のみ返す
    return matchesSearchQuery && isAfterStartDate;
  }); 
  
  //--以上検索---------------------------------------------------------------
  return (
    <div className="flex h-screen">
      <aside className="w-1/5 bg-zinc-950 text-white p-6 text-center">
        <h2 className="text-xl font-bold mb-6">管理者メニュー</h2>
        <ul>
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded bg-amber-600 hover:bg-amber-400"
              onClick={() => setSelectedContent("users")}
            >
              団員情報
            </button>
          </li>
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded bg-amber-600 hover:bg-amber-400"
              onClick={() => setSelectedContent("location")}
            >
              出場情報
            </button>
          </li>
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded bg-amber-600 hover:bg-amber-400"
              onClick={() => setSelectedContent("requests")}
            >
              要望確認
            </button>
          </li>
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded bg-amber-600 hover:bg-amber-400"
              onClick={() => setSelectedContent("post")}
            >
              掲示板投稿
            </button>
          </li>
          <li>
            <button
              className="w-full text-left py-2 px-4 rounded bg-amber-600 hover:bg-amber-400"
              onClick={() => setSelectedContent("bulletin")}
            >
              掲示板確認
            </button>
          </li>
        </ul>
      </aside>

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
          {error && <p className="text-red-500">エラー: {error}</p>}


          {/* 団員情報 */}
          {selectedContent === "users" && (
            <div>
              <h3 className="text-lg font-semibold">団員情報</h3>
            
              <button
                className="w-sm text-left py-2 px-4 rounded bg-slate-600 hover:bg-slate-300 text-white my-3"
                onClick={() => setSelectedContent("")}
              >
                閉じる
              </button>
              {selectedContent && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="キーワード検索"
                className="w-full py-2 px-4 border rounded"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          )}

              <ul>
                {filteredUsers.map((user) => (
                  <li key={user.id} className="p-2 bg-gray-200 mb-2 rounded">
                    {user.group} 分団: {user.username}
                    <button
                      className={`ml-4 px-2 py-1 rounded text-white ${
                        user.executive === 1
                          ? "bg-red-500 hover:bg-red-700"
                          : "bg-blue-500 hover:bg-blue-700"
                      }`}
                      onClick={() => toggleExecutive(user.id, user.executive)}
                    >
                      {user.executive === 1 ? "幹部" : "団員"}
                    </button>
                    <button
                      onClick={() => deleteUser(user.id)}
                      className={"bg-black ml-4 px-2 py-1 rounded text-white"}
                    >
                      削除
                    </button>
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
              <br />
              <label className="text-gray-700 font-semibold my-3 mx-2">
                日付検索:
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-3 mr-2"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="p-2 border border-gray-300 rounded mb-3"
              />
              {/* リセットボタン */}
              <button
                onClick={resetDates}
                className="p-2 bg-blue-500 text-white rounded mx-2"
              >
                日付を削除
              </button>
              {selectedContent && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="キーワード検索"
                className="w-full py-2 px-4 border rounded"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          )}


              <ul>
                {filteredLocations.map((log) => {
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

          {/* // 要望確認表示 */}
          {selectedContent === "requests" && (
            <div>
              <h3 className="text-lg font-semibold">要望確認</h3>

              <button
                className="w-sm text-left py-2 px-4 rounded bg-slate-600 hover:bg-slate-300 text-white my-3"
                onClick={() => setSelectedContent("")}
              >
                閉じる
              </button>

              {/* 切り替えボタン */}
              <button
                onClick={() => setIsShowingCompleted(!isShowingCompleted)}
                className="px-4 py-2 mb-4 rounded bg-green-500 text-white mx-2"
              >
                {isShowingCompleted ? "未対応へ" : "対応済へ"}
              </button>

              {/* 日付検索エリア  */}
              <div className="mt-3 flex">
                <label className="text-gray-700 font-semibold my-3 mx-2">
                  日付検索:
                </label>
                <div className="flex">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="block mt-1 px-4 py-2 border rounded bg-gray-100 focus:outline-none focus:border-blue-500"
                />
              </div>
              <button
                onClick={resetDates}
                className="p-2 bg-blue-500 text-white rounded mx-2"
              >
                日付を削除
              </button>
              </div>
              {selectedContent && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="キーワード検索"
                className="w-full py-2 px-4 border rounded mt-3"
                value={searchQuery}
                onChange={handleSearch}
              />
            </div>
          )}


              {/* 未対応 or 対応済 リストの切り替え */}
              {isShowingCompleted ? (
                // 対応済の要望リスト
                <div>
                  <h4 className="text-md font-semibold mt-4">対応済</h4>
                  <ul>
                    {filteredRequests
                      .filter((request) => request.status === 1)
                      .map((request) => (
                        <li
                          key={request.request_id}
                          className="p-2 bg-gray-200 mb-2 rounded"
                        >
                          {new Date(request.created_at).toLocaleString(
                            "ja-JP",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )}
                          <br />
                          要望者: {request.username}
                          <br />
                          {request.group} 分団
                          <br />
                          要望: {request.content}
                          <br />
                          <button
                            className="mt-2 px-4 py-1 text-white rounded bg-red-500 hover:bg-red-700"
                            onClick={() =>
                              toggleStatus(request.request_id, request.status)
                            }
                          >
                            対応済
                          </button>
                          <button
                            onClick={() => deleteRequests(request.request_id)}
                            className="bg-black ml-4 px-2 py-1 rounded text-white my-2"
                          >
                            削除
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              ) : (
                // 未対応の要望リスト
                <div>
                  <h4 className="text-md font-semibold mt-4">未対応</h4>
                  <ul>
                    {filteredRequests
                      .filter((request) => request.status === 0)
                      .map((request) => (
                        <li
                          key={request.request_id}
                          className="p-2 bg-gray-200 mb-2 rounded"
                        >
                          {new Date(request.created_at).toLocaleString(
                            "ja-JP",
                            {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            }
                          )}
                          <br />
                          要望者: {request.username}
                          <br />
                          {request.group} 分団
                          <br />
                          要望: {request.content}
                          <br />
                          <button
                            className="mt-2 px-4 py-1 text-white rounded bg-blue-500 hover:bg-blue-700"
                            onClick={() =>
                              toggleStatus(request.request_id, request.status)
                            }
                          >
                            未対応
                          </button>
                          <button
                            onClick={() => deleteRequests(request.request_id)}
                            className="bg-black ml-4 px-2 py-1 rounded text-white my-2"
                          >
                            削除
                          </button>
                        </li>
                      ))}
                  </ul>
                </div>
              )}
            </div>
          )}
          {selectedContent === "post" && (
            <AdminPostForm onClose={() => setSelectedContent(null)} />
          )}
          {selectedContent === "bulletin" && (
            <BulletinBoard
              isAdmin={true}
              onClose={() => setSelectedContent(null)}
            />
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
