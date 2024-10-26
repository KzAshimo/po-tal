"use client";
import "../globals.css";

const Admin = () => {
  return (
    <div className="flex h-screen">
      {/* サイドバー */}
      <aside className="w-1/5 bg-gray-800 text-white p-6">
        <h2 className="text-xl font-bold mb-6">管理者メニュー</h2>
        <ul>
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded bg-teal-500 hover:bg-emerald-600"
              type="button"
            >
              団員情報
            </button>
          </li>
          <li className="mb-4">
            <button
              className="w-full text-left py-2 px-4 rounded bg-teal-500 hover:bg-emerald-600"
              type="button"
            >
              要望確認
            </button>
          </li>
          <li>
            <button
              className="w-full text-left py-2 px-4 rounded bg-teal-500 hover:bg-emerald-600"
              type="button"
            >
              掲示板
            </button>
          </li>
        </ul>
      </aside>

      {/* メインコンテンツエリア */}
      <main className="flex-1 bg-amber-100 p-8">
        <div className="flex justify-between items-center bg-white p-4 shadow-lg mb-4">
          <h1 className="text-xl">
            ようこそ <span className="font-bold underline">管理者</span> 様
          </h1>
          <button className="rounded bg-red-500 px-4 py-2 text-white hover:bg-pink-800">
            ログアウト
          </button>
        </div>

        <div className="bg-slate-100 p-6 shadow-lg rounded">
          <h2 className="text-2xl font-bold mb-4">メインコンテンツ</h2>
          <p>ここに選択されたメニューの内容が表示されます。</p>
        </div>
      </main>
    </div>
  );
};

export default Admin;
