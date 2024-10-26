import React from "react";

type DispatchModalProps = {
  onClose: () => void;
  onStartDispatch: () => void;
};

const DispatchModal: React.FC<DispatchModalProps> = ({ onClose, onStartDispatch }) => {
  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded shadow-lg text-center">
        <h2 className="text-2xl font-bold mb-4">現在地、現時刻を送信します。</h2>
        <p className="mb-6">よろしいでしょうか？</p>
        <button
          className="bg-lime-600 text-white py-2 px-4 rounded hover:bg-cyan-600 m-2"
          onClick={onStartDispatch}
        >
          災害出場
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

export default DispatchModal;
