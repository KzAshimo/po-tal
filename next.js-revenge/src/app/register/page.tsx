'use client';
import { useRouter } from 'next/navigation';
import '../globals.css';
import React, { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [groupname, setGroupname] = useState(''); // group から group_id に変更
  const [message, setMessage] = useState('');
  const [showCompleteModal, setShowCompleteModal] = useState(false); //完了モーダル
  const [showConfirmModal, setShowConfirmModal] = useState(false); //確認モーダル
  const [passView, setPassView] = useState(false);
  const router = useRouter();

  const handleConfirm = (e: React.FormEvent) => { //確認モーダル
    e.preventDefault();
    setShowConfirmModal(true);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const res = await fetch('/api/user/registUser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        group_name:groupname,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setShowConfirmModal(false); //確認モーダル　閉
      setShowCompleteModal(true); //完了モーダル　開
      setUsername('');
      setPassword('');
      setGroupname(''); // group から group_id に変更
    } else {
      setMessage(`Error: ${data.message}`);
      setShowConfirmModal(false); //確認モーダル　閉
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cyan-50">
      <form onSubmit={handleConfirm} className="w-1/3 p-8 bg-white shadow-lg rounded">
        <h2 className="text-2xl font-bold mb-6">ユーザー登録</h2>

        {message && <p className="text-red-500">{message}</p>}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">ユーザー名</label>
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

          <input
            type={passView ? 'text' : 'password'}
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setPassView(!passView)} // ボタンをクリックすると表示状態を切り替え
            className="bg-slate-100 text-black rounded text-sm p-1"
          >
            {passView ? "表示" : "非表示"} {/* 表示状態によってアイコンを切り替え */}
          </button>
        </div>
        
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">分団名</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={groupname}
            onChange={(e) => setGroupname(e.target.value)} // group から group_id に変更
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 text-white py-2 rounded hover:bg-lime-700"
        >
          登録
        </button>

        <button
          type="button"
          className="w-full bg-cyan-700 text-white py-2 rounded mt-4 hover:bg-lime-500"
          onClick={() => router.push('/')}
        >
          ログインへ戻る
        </button>
      </form>

      {/* 完了モーダル */}
      {showCompleteModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">作成完了</h2>
            <p className="mb-6">ユーザー登録が完了しました！</p>
            <button
              className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-cyan-600"
              onClick={() => router.push('/')} // ログインページへリダイレクト
            >
              ログインへ戻る
            </button>
          </div>
        </div>
      )}

      {/* 確認モーダル */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">確認</h2>
            <p>ユーザー名: {username}</p>
            <p>パスワード: {password}</p>
            <p>グループID: {groupname}</p> {/* group から group_id に変更 */}
            <button
              className="bg-cyan-900 text-white py-2 px-4 rounded mt-4 hover:bg-lime-500"
              onClick={handleRegister}
            >
              本登録する
            </button>
            <br />
            <button
              className="bg-cyan-700 text-white py-2 px-4 rounded mt-4 hover:bg-lime-700"
              onClick={() => setShowConfirmModal(false)}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Register;
