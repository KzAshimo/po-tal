import React, { useState } from "react";

interface AdminPostProps{
  onClose:()=>void;
}

const AdminPostForm = ({onClose}:AdminPostProps) =>{
    const [title,setTitle] = useState("");
    const [content,setContent] = useState("");
    const [error,setError] = useState<string | null>(null);
    const [success,setSuccess] = useState(false);

    const handleSubmit = async(e:React.FormEvent) =>{
        e.preventDefault();

        try{
            const response = await fetch("/api/board/create",{
                method:"POST",
                headers:{"Content-Type":"application/json"},
                body:JSON.stringify({title,content}),
            });
            if(!response.ok){
                throw new Error("投稿エラー");
            }
            setSuccess(true);
            setTitle("");
            setContent("");
        }catch(err){
            setError((err as Error).message);
        }
    };
    return(
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">新規投稿</h2>
        <button
        onClick={onClose}
        className="w-sm text-left py-2 px-4 rounded bg-slate-600 hover:bg-slate-300 text-white my-1"
      >
        閉じる
      </button>

        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">投稿が完了しました！</p>}
        
        <div className="mb-4">
          <label className="block mb-1 font-semibold">タイトル</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-semibold">内容</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded"
            required
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          投稿する
        </button>
      </form>
    );
};

export default AdminPostForm;