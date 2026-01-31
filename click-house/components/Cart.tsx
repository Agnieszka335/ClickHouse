import React from 'react';
import { CartItem } from '../types';
import { X, Minus, Plus, Trash2 } from 'lucide-react';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  userId: string | null;
  onUpdateQuantity: (id: string, delta: number) => void;
  onRemove: (id: string) => void;
  onCheckout: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose, items, userId, onUpdateQuantity, onRemove, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={`fixed inset-y-0 right-0 w-80 bg-ch-bg-medium z-[100] shadow-2xl p-6 flex flex-col border-l border-ch-secondary transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
      <div className="flex justify-between items-center pb-4 border-b border-gray-700">
        <h3 className="text-2xl font-heading text-ch-secondary">🛒 Twój Koszyk</h3>
        <button onClick={onClose} className="text-ch-primary hover:text-white transition duration-200">
          <X size={24} />
        </button>
      </div>

      <div className="flex-grow overflow-y-auto mt-4 space-y-4">
        {items.length === 0 ? (
          <p className="text-ch-gray py-4 text-center">Twój koszyk jest pusty.</p>
        ) : (
          <ul className="space-y-4">
            {items.map((item) => (
              <li key={item.id} className="flex justify-between items-center pb-2 border-b border-gray-800 last:border-0 animate-fade-in">
                <div className="flex-grow pr-2">
                  <p className="font-bold text-ch-text-light text-sm">{item.name}</p>
                  <p className="text-xs text-ch-gray">{item.price.toFixed(2)} zł x {item.quantity}</p>
                </div>
                <div className="flex items-center space-x-2 shrink-0">
                  <button 
                    onClick={() => onUpdateQuantity(item.id, -1)}
                    className="text-ch-secondary hover:text-white p-1 rounded-full border border-ch-secondary hover:bg-[#202020]"
                  >
                    <Minus size={12} />
                  </button>
                  <span className="text-sm w-4 text-center">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQuantity(item.id, 1)}
                    className="text-ch-secondary hover:text-white p-1 rounded-full border border-ch-secondary hover:bg-[#202020]"
                  >
                    <Plus size={12} />
                  </button>
                  <button 
                    onClick={() => onRemove(item.id)} 
                    className="text-red-500 hover:text-red-400 ml-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="pt-4 mt-4 border-t-2 border-ch-primary">
        <div className="flex justify-between items-center text-xl font-bold mb-4">
          <span>Suma:</span>
          <span className="text-ch-secondary">{total.toFixed(2)} zł</span>
        </div>
        <button 
            onClick={onCheckout}
            disabled={items.length === 0}
            className={`w-full py-3 rounded-lg font-bold transition duration-300 shadow-neon flex items-center justify-center ${items.length === 0 ? 'bg-gray-600 cursor-not-allowed opacity-50' : 'bg-ch-primary text-ch-bg-dark hover:bg-[#8d5ed8]'}`}
        >
          DALEJ DO PŁATNOŚCI 💳
        </button>
      </div>
      
      {userId && <p className="mt-4 text-[10px] text-ch-gray break-all text-center">ID: {userId}</p>}
    </div>
  );
};

export default Cart;