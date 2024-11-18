import { useEffect, useState } from "react";

interface Post {
  board_id: number;
  title: string;
  content: string;
  created_at: string;
}

interface BulletinBoardProps {
  isAdmin?: boolean;
  onClose: () => void;
}

const BulletinBoard = ({ isAdmin = false, onClose }: BulletinBoardProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState<string>(""); // 日付検索
  const [searchQuery, setSearchQuery] = useState<string>(""); // キーワード検索

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const url = new URL("/api/board/post", window.location.origin);

        if (searchDate) {
          url.searchParams.append("startDate", searchDate);
        }
        if (searchQuery) {
          url.searchParams.append("searchTerm", searchQuery);
        }

        const response = await fetch(url.toString());
        if (!response.ok) {
          throw new Error("データ取得エラー");
        }
        const data = await response.json();
        setPosts(data.posts);
      } catch (err) {
        setError((err as Error).message);
      }
    };

    fetchPosts();
  }, [searchDate, searchQuery]);

  const handleDelete = async (postId: number) => {
    try {
      const response = await fetch(`/api/board/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postId }),
      });
      if (!response.ok) {
        throw new Error("削除に失敗しました");
      }
      setPosts((prevPosts) => prevPosts.filter((post) => post.board_id !== postId));
    } catch (err) {
      setError((err as Error).message);
    }
  };

  // 日付のリセット処理
  const handleResetDate = () => {
    setSearchDate("");
  };

  // キーワードの検索処理
  const handleSearchQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div className="p-1">
      <h2 className="text-xl font-bold mb-4">掲示板</h2>
      {isAdmin && (
        <button
          onClick={onClose}
          className="w-sm text-left py-2 px-4 rounded bg-slate-600 hover:bg-slate-300 text-white my-1"
        >
          閉じる
        </button>
      )}

      {/* 日付フィルター */}
      <div className="my-4">
        <label className="mr-2">日付で検索:</label>
        <input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="border px-2 py-1"
        />
        <button
          onClick={handleResetDate}
          className="ml-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-gray-700"
        >
          日付を削除
        </button>
      </div>

      {/* キーワード検索フィルター */}
      <div className="my-4">
        <input
          type="text"
          placeholder="キーワード検索"
          value={searchQuery}
          onChange={handleSearchQueryChange}
          className="w-full py-2 px-4 border rounded"
        />
      </div>

      {error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.board_id} className="bg-gray-100 p-4 mb-2 rounded shadow">
              <small>{new Date(post.created_at).toLocaleString("ja-JP")}</small>
              {isAdmin && (
                <button
                  onClick={() => handleDelete(post.board_id)}
                  className="mt-2 px-4 py-1 text-white rounded bg-black hover:bg-red-700 mx-3"
                >
                  削除
                </button>
              )}
              <h3 className="text-lg font-semibold my-1">{post.title}</h3>
              <p>{post.content}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default BulletinBoard;
