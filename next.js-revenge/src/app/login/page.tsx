"use client"

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () =>{
    const [username,setUsername] = useState('');
    const [password,setPassword] = useState('');
    const [error,setError] = useState('');
    const router = useRouter();

    const handleSubmit = async(e:React.FormEvent<HTMLFormElement>) =>{
        e.preventDefault();
        try{
            const res = await fetch('api/login',{
                method:'POST',
                headers:{
                    'Content-Type':'application/json',
                },
                body:JSON.stringify({username,password}),
            });
            const data = await res.json();

            if(res.ok){
                router.push('/main')
            }else{
                setError(data.message || 'ログイン失敗')
            }
        } catch(err){
            setError('error')
        }
    };

    return (
        <div className="flex items-center justify-center h-screen">
          <form onSubmit={handleSubmit} className="w-1/3 p-8 bg-white shadow-lg rounded">
            <h2 className="text-2xl font-bold mb-6">ログイン</h2>
    
            {error && <p className="text-red-500">{error}</p>}
    
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">ユーザーネーム</label>
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
                type="password"
                className="w-full p-2 border border-gray-300 rounded"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
    
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
            >
              ログイン
            </button>

             {/* ユーザー登録へのボタン */}
        <button
          type="button"
          className="w-full bg-green-500 text-white py-2 rounded mt-4 hover:bg-green-600"
          onClick={() => router.push('/register')} // クリック時に /register へ遷移
        >
          新規登録
        </button>

          </form>
        </div>
      );

};

export default LoginPage;