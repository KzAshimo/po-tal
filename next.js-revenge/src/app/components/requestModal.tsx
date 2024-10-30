import React,{useState} from "react";

type RequestModalProps = {
  onClose: () => void;
  onSubmit:(group:number,content:string) => void;
};

const RequestModal: React.FC<RequestModalProps> = ({ onClose,onSubmit }) => {
  const [group,setGroup] = useState<number>();
  const [content,setContent] = useState<string>("");
  const [showConfirmModal,setShowConfirmModal] = useState(false); //確認モーダル

  const openModal = () =>{
    setShowConfirmModal(true);
  }
  const closeModal = ()=>{
    setShowConfirmModal(false);
  }
  const sendMessage = () =>{
    if(group && content){
      onSubmit(group,content);
      onClose();
    }else{
      alert("入力漏れがあります。")
    }
  }


  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-2xl font-bold m-3">要望を送信する</h2>
        <input
          type="number"
          className="w-1/3 p-2 border border-gray-300 rounded my-3"
          required
          placeholder="分団を入力"
          onChange={(e)=>setGroup(e.target.value)}
        />
        <textarea
          className="w-full p-2 border border-gray-300 rounded h-32 resize-none"
          required
          placeholder="要望を入力"
          onChange={(e)=>setContent(e.target.value)}
        />
        <button className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-cyan-600 m-2"
        onClick={openModal}>
          要望を送信
        </button>
        <br />
        <button
          className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-cyan-600 m-2"
          onClick={onClose}
        >
          閉じる
        </button>
      </div>

             {/* 確認モーダル */}
             {showConfirmModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">以下の内容で送信します</h2>
            <p><span className="font-bold text-red-500 text-2xl m-3 p-1">{group}</span>分団</p>
            <p className="text-start font-bold">要望内容</p>
            <p className="font-bold text-xl m-2 border-solid border-2 border-slate-800 whitespace-pre-wrap text-start p-2"> {content}</p>
            <button
              className="bg-cyan-900 text-white py-2 px-4 rounded mt-4 hover:bg-lime-500"
              onClick={sendMessage}
            >
              要望を送信
            </button>
            <br />
            <button
              className="bg-cyan-700 text-white py-2 px-4 rounded mt-4 hover:bg-lime-700"
              onClick={closeModal}
            >
              キャンセル
            </button>
          </div>
        </div>
      )}



    </div>
  );
};

export default RequestModal;
