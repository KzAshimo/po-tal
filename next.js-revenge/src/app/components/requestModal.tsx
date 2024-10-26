import React,{useState} from "react";

type RequestModalProps = {
  onClose: () => void;
  onSubmit:(group:number,content:string) => void;
};

const RequestModal: React.FC<RequestModalProps> = ({ onClose,onSubmit }) => {
  const [group,setGroup] = useState<number>("");
  const [content,setContent] = useState<string>("");

  const sendText = () =>{
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
          className="w-3/4 p-2 border border-gray-300 rounded h-32 resize-none"
          required
          placeholder="要望を入力"
          onChange={(e)=>setContent(e.target.value)}
        />
        <button className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-cyan-600 m-2"
        onClick={sendText}>
          要望を送信する
        </button>
        <br />
        <button
          className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-cyan-600 m-2"
          onClick={onClose}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default RequestModal;
