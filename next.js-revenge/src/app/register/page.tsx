'use client';
import '../globals.css';
import { useState } from 'react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [group, setGroup] = useState('');
  const [message, setMessage] = useState('');

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
      setMessage('User registered successfully');
    } else {
      setMessage(`Error: ${data.message}`);
    }
  };

  return (
    <div className='text-center my-5'>
      <h1 className='text-lg my-2'>ユーザー登録</h1>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username} 
          onChange={(e) => setUsername(e.target.value)} 
          required 
          className='text-center'
        />
        <br />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
          className='text-center'
        />
        <br />
        <input 
          type="number" 
          placeholder="Group" 
          value={group} 
          onChange={(e) => setGroup(e.target.value)} 
          required 
          className='text-center'
        />
        <br />
        <button type="submit">登録</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}
