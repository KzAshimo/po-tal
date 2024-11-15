"use client"; // この行を追加

import { useEffect, useState } from 'react'

export default function Home() {
  const [data, setData] = useState<{ username: string }[] | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('/api/test')
      const result = await response.json()

      // resultがそのまま配列の場合は、setDataにresultをそのまま渡す
      setData(result) 
    }

    fetchData()
  }, [])

  return (
    <div>
      <h1>ユーザー名一覧</h1>
      <ul>
        {data ? (
          data.map((user, index) => (
            <li key={index}>{user.username}</li>
          ))
        ) : (
          <p>データを読み込み中...</p>
        )}
      </ul>
    </div>
  )
}
