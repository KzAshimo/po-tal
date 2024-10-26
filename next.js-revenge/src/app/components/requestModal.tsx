import React from "react";

type RequestModalProps = {
  onClose: () => void;
};

const RequestModal: React.FC<RequestModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-2xl font-bold m-3">要望を送信する</h2>
        <input
          type="text"
          className="w-3/4 p-2 border border-gray-300 rounded my-3"
          required
          placeholder="ここにタイトルを入力してください"
        />
        <textarea
          className="w-3/4 p-2 border border-gray-300 rounded h-32 resize-none"
          required
          placeholder="ここに要望の内容を入力してください"
        />
        <button className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-cyan-600 m-2">
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
