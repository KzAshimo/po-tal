"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [passView, setPassView] = useState(false);
  const router = useRouter();

  const openModal = () => {
    setShowModal(true);
  };
  const closeModal = () => {
    setShowModal(false);
  };
  //ゲストログイン
  const guestLogin = async () => {
    const guestUsername = "guest";
    const guestPassword = "guest";

    const res = await fetch("api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: guestUsername,
        password: guestPassword,
      }),
    });
    if (res.ok) {
      router.push("/main");
    } else {
      console.log("ゲスト認証失敗");
    }
  };
  //通常ログイン
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch("api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();

      if (res.ok) {
        router.push("/main");
      } else {
        setError(data.message || "ログイン失敗");
      }
    } catch (err) {
      setError("error");
    }
  };
  //管理者ログイン
  const adminLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/admin/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: adminPass }),
      });

      const data = await res.json();

      if (res.ok) {
        console.log("管理者ログイン成功");
        setShowModal(false);
        router.push("/admin");
      } else {
        setError(data.message || "アドミンログインエラー");
      }
    } catch (err) {
      setError("エラー");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cyan-50">
      <form
        onSubmit={handleSubmit}
        className="w-1/3 p-8 bg-white shadow-lg rounded"
      >
        <h2 className="text-2xl font-bold mb-6">ログイン</h2>

        {error && <p className="text-red-500">{error}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            ユーザーネーム
          </label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">パスワード</label>

          <button
            type="button"
            onClick={() => setPassView(!passView)} // ボタンをクリックすると表示状態を切り替え
            className="bg-slate-100 text-black rounded text-sm p-1"
          >
            {passView ? "表示" : "非表示"}{" "}
            {/* 表示状態によってアイコンを切り替え */}
          </button>

          <input
            type={passView ? "text" : "password"}
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-400 text-white py-2 rounded hover:bg-lime-800"
        >
          ログイン
        </button>

        {/* ユーザー登録へのボタン */}
        <button
          type="button"
          className="w-full bg-cyan-600 text-white py-2 rounded mt-4 hover:bg-lime-600"
          onClick={() => router.push("/register")} // クリック時に /register へ遷移
        >
          新規登録
        </button>

        <button
          type="button"
          onClick={guestLogin}
          className="w-full bg-cyan-800 text-white py-2 rounded mt-4 hover:bg-lime-400"
        >
          ゲストログイン
        </button>
      </form>

      <button
        type="button"
        onClick={openModal}
        className="right-2 top-2 absolute rounded bg-slate-400 p-2 text-white hover:bg-red-500"
      >
        管理者ログイン
      </button>

      {showModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">管理者認証</h2>
            <form onSubmit={adminLogin}>
              <label className="block text-sm font-medium mb-1">
                パスワード
              </label>

              <button
                type="button"
                onClick={() => setPassView(!passView)} // ボタンをクリックすると表示状態を切り替え
                className="bg-slate-100 text-black rounded text-sm p-1"
              >
                {passView ? "表示" : "非表示"}{" "}
                {/* 表示状態によってアイコンを切り替え */}
              </button>

              <input
                type={passView ? "text" : "password"}
                className="w-full p-2 border border-gray-300 rounded"
                value={adminPass}
                onChange={(e) => setAdminPass(e.target.value)}
                required
              />
              <button
                className="bg-slate-500 text-white mt-4 py-2 px-4 rounded hover:bg-slate-100 hover:text-black"
                type="submit"
              >
                管理者ログイン
              </button>
            </form>
            <br />
            <button
              className="bg-slate-500 text-white m-2 py-2 px-4 rounded hover:bg-slate-100 hover:text-black"
              onClick={closeModal}
            >
              閉じる
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;
