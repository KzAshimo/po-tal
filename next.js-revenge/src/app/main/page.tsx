"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import "../globals.css";
import DispatchModal from "../components/dispatchModal";
import RequestModal from "../components/requestModal";

const Main: React.FC = () => {
  const [dispatchModal, setDispatchModal] = useState(false);
  const [requestModal, setRequestModal] = useState(false);
  const [username, setUsername] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("トークンが見つかりません。再度ログインしてください。");
        router.push("/");
        return;
      }

      const res = await fetch("/api/user/getUsername", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setUsername(data.username);
      } else {
        alert("エラー: " + data.message);
        router.push("/");
      }
    };
    fetchData();
  }, [router]);

  const startDispatch = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        const token = localStorage.getItem("token");

        const res = await fetch("/api/dispatch/start", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ latitude, longitude }),
        });

        if (res.ok) {
          router.push(`/dispatch`);
        } else {
          alert("エラー");
        }
      });
    } else {
      alert("GPS機能をONにして下さい");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };

  const onSubmitReq = async(group:number,content:string) =>{
    const token = localStorage.getItem("token");
    const res = await fetch("api/requests",{
      method:"POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ group, content}),
    })

    if(res.ok){
      alert("送信完了");
    }else{
      alert("送信失敗");
    }
  }

  return (
    <>
      <div className="flex bg-white p-3">
        <h1 className="mx-5 p-2">
          ようこそ{" "}
          <span className="text-xl px-2 font-bold underline underline-offset-4">
            {username}
          </span>{" "}
          さん
        </h1>
        <button
          className="mx-4 rounded bg-red-500 p-2 text-white hover:bg-pink-800"
          onClick={handleLogout}
        >
          ログアウト
        </button>
      </div>

      
      <div className="flex flex-wrap items-center justify-center h-screen bg-cyan-100">
        <form className="w-1/3 h-auto p-8 bg-slate-100 shadow-lg rounded m-5">
          <h1 className="text-2xl font-bold">出場報告</h1>
          <p className="py-2">
            報告を行います。 下記ボタンクリックで時刻、位置を本部へ送信します。
          </p>
          <button
            type="button"
            className="bg-teal-500 text-white py-2 rounded mt-4 hover:bg-emerald-600 px-2"
            onClick={() => setDispatchModal(true)}
          >
            災害出場画面へ
          </button>
        </form>

        <form className="w-1/3 h-auto p-8 bg-slate-100 shadow-lg rounded m-5">
          <h1 className="text-2xl font-bold">本部へ要望</h1>
          <p className="py-1">
            本部へ要望を行います。
            <br />
            なお、こちらの機能は幹部のみ使用可能です。
          </p>
          <button
            type="button"
            className="bg-teal-500 text-white py-2 rounded mt-1 hover:bg-emerald-600 px-1"
            onClick={() => setRequestModal(true)}
          >
            要望を行う
          </button>
        </form>

        <form className="w-full p-8 bg-slate-100 shadow-lg rounded mx-5">
          <h1 className="text-2xl font-bold">掲示板</h1>
          <p>掲示板予定</p>
        </form>
      </div>

      {dispatchModal && (
        <DispatchModal onClose={() => setDispatchModal(false)} onStartDispatch={startDispatch} />
      )}

      {requestModal && (
        <RequestModal onClose={() => setRequestModal(false)} onSubmit={onSubmitReq}/>
      )}
    </>
  );
};

export default Main;
