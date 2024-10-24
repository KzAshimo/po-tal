'use client';
import '../globals.css';
import { useEffect,useState } from 'react';
import { useRouter } from 'next/navigation';


const Dispatch = () =>{
    const [seconds,setSeconds] = useState<number>(0);
    const router = useRouter();

    useEffect(()=>{
        const interval = setInterval(()=>{
            setSeconds((prev)=> prev +1 );
        },1000);
        return ()=> clearInterval(interval);
    },[]);

    //終了ボタンの処理
    const endDispatch = async () =>{
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition(async (position) =>{
                const {latitude,longitude} = position.coords;

                const dispatchId = 1;

                const res = await fetch(`/api/dispatch/end`,{
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    body:JSON.stringify({
                        id:useId,
                        latitude,
                        longitude,
                        duration:seconds,
                    })
                });

                if(res.ok){
                    alert('終了しました');
                    router.push('/main');
                }else{
                    const errorData = await res.json();
                    alert(`エラーが発生しました: ${errorData.message}`);                }
            })
        }
    }

    return (
        <div className="container">
          <h1>タイマー: {seconds} 秒</h1>
          <button
            onClick={endDispatch}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            出場終了
          </button>
        </div>
      );

}

export default Dispatch;