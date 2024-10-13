'use client';
import { useRouter } from 'next/navigation';
import '../globals.css';
import { useState } from 'react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [group, setGroup] = useState('');
  const [message, setMessage] = useState('');
  const [showModal,setShowModal] = useState(false);
  const [passView,setPassView] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        password,
        group,
      }),
    });

    const data = await res.json();
    if (res.ok) {
      setShowModal(true);
      setUsername('');
      setPassword('');
      setGroup('');
    } else {
      setMessage(`Error: ${data.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <form onSubmit={handleSubmit} className="w-1/3 p-8 bg-white shadow-lg rounded">
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

          <button
            type="button"
            onClick={() => setPassView(!passView)} // ボタンをクリックすると表示状態を切り替え
            className="bg-slate-100 text-black rounded text-sm p-1"
          >
            {passView ? "表示" : "非表示"} {/* 表示状態によってアイコンを切り替え */}
          </button>

          <input
            type={passView ? 'text':'password'}
            className="w-full p-2 border border-gray-300 rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">グループ名</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
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

      {showModal && (
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

    </div>
  );}
export default Register;