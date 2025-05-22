import React from "react";

type AddBalanceModalProps = {
  show: boolean;
  onClose: () => void;
  onSave: (balance: string) => void;
  value: string;
  setValue: (val: string) => void;
};

const AddBalanceModal: React.FC<AddBalanceModalProps> = ({
  show,
  onClose,
  onSave,
  value,
  setValue,
}) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 shadow-2xl min-w-[320px] flex flex-col items-center animate-fade-in">
        <h2 className="text-xl font-bold mb-4 text-blue-700">Add Balance</h2>
        <input
          type="number"
          className="border border-gray-300 rounded px-4 py-2 mb-4 w-full text-center focus:outline-none focus:ring focus:border-blue-400"
          placeholder="Masukkan saldo baru"
          value={value}
          onChange={e => setValue(e.target.value)}
          autoFocus
        />
        <div className="flex gap-3">
          <button
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition"
            onClick={() => {
              onSave(value);
              onClose();
            }}
          >
            Simpan
          </button>
          <button
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 transition"
            onClick={onClose}
          >
            Batal
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddBalanceModal;
