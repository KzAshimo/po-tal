import { useEffect, useState } from "react"

interface Post{
    id:number,
    title:string,
    content:string,
    created_at:string;
}

const BulletinBoard = () =>{
    const [posts,setPosts] = useState<Post[]>([]);
    const [error,setError] = useState<string | null>(null);

    useEffect(()=>{
        const fetchPosts = async ()=>{
            try{
                const response = await fetch("/api/board/post");
                if(!response) {
                    throw new Error("データ取得エラー");
                }
                const data = await response.json();
                setPosts(data.posts);
            }catch(err){
                setError((err as Error).message);
            }
        };
        fetchPosts()
    },[]);
    return(
        <div className="p-4">
        <h2 className="text-xl font-bold mb-4">掲示板</h2>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <ul>
            {posts?.map((post) => (
              <li key={post.id} className="bg-gray-100 p-4 mb-2 rounded shadow">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p>{post.content}</p>
                <small>{new Date(post.created_at).toLocaleString("ja-JP")}</small>
              </li>
            ))}
          </ul>
        )}
      </div>
    );
}

export default BulletinBoard;