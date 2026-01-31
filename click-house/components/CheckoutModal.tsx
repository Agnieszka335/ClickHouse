import React, { useState } from 'react';
import { X, CreditCard, Truck, CheckCircle, Loader } from 'lucide-react';
import { CartItem } from '../types';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  total: number;
  onPaymentSuccess: () => void;
}

const CheckoutModal: React.FC<CheckoutModalProps> = ({ isOpen, onClose, items, total, onPaymentSuccess }) => {
  const [step, setStep] = useState<'form' | 'processing' | 'success'>('form');
  const [formData, setFormData] = useState({
      name: '',
      email: '',
      address: '',
      card: ''
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      setStep('processing');
      // Simulate API call
      setTimeout(() => {
          setStep('success');
          setTimeout(() => {
              onPaymentSuccess();
              setStep('form');
              setFormData({ name: '', email: '', address: '', card: '' });
          }, 2500);
      }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-[200] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-ch-bg-medium w-full max-w-2xl rounded-2xl shadow-neon border border-ch-secondary/30 overflow-hidden flex flex-col md:flex-row relative animate-fade-in">
        <button onClick={onClose} className="absolute top-4 right-4 text-ch-gray hover:text-white z-10">
            <X size={24} />
        </button>

        {/* Order Summary Sidebar */}
        <div className="md:w-1/3 bg-[#101010] p-6 border-r border-gray-800">
            <h4 className="text-ch-secondary font-heading text-xl mb-4">Twój Koszyk</h4>
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar mb-4">
                {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-gray-300 truncate w-24">{item.name}</span>
                        <span className="text-gray-500">x{item.quantity}</span>
                        <span className="text-white">{(item.price * item.quantity).toFixed(0)} zł</span>
                    </div>
                ))}
            </div>
            <div className="border-t border-gray-700 pt-4 flex justify-between items-center text-lg font-bold">
                <span>Razem:</span>
                <span className="text-ch-primary">{total.toFixed(2)} zł</span>
            </div>
        </div>

        {/* Payment Form Area */}
        <div className="md:w-2/3 p-8 relative">
            {step === 'form' && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-2xl font-heading text-white mb-6 flex items-center gap-2">
                        <CreditCard className="text-ch-primary" /> Płatność
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <input 
                            type="text" placeholder="Imię i Nazwisko" required
                            value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                            className="w-full bg-[#181818] border border-gray-700 p-3 rounded text-white focus:border-ch-secondary outline-none"
                        />
                         <input 
                            type="email" placeholder="Email" required
                            value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                            className="w-full bg-[#181818] border border-gray-700 p-3 rounded text-white focus:border-ch-secondary outline-none"
                        />
                    </div>
                    <input 
                        type="text" placeholder="Adres dostawy" required
                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                        className="w-full bg-[#181818] border border-gray-700 p-3 rounded text-white focus:border-ch-secondary outline-none"
                    />
                    
                    <div className="relative">
                        <input 
                            type="text" placeholder="Numer Karty (Symulacja)" required
                            value={formData.card} onChange={e => setFormData({...formData, card: e.target.value})}
                            className="w-full bg-[#181818] border border-gray-700 p-3 rounded text-white focus:border-ch-secondary outline-none pl-10"
                        />
                        <CreditCard className="absolute left-3 top-3.5 text-gray-500" size={18} />
                    </div>

                    <div className="flex gap-4 text-xs text-gray-500 py-2">
                        <div className="flex items-center gap-1"><Truck size={14}/> Darmowa dostawa</div>
                        <div className="flex items-center gap-1">🔒 Szyfrowanie SSL</div>
                    </div>

                    <button type="submit" className="w-full bg-ch-primary text-ch-bg-dark font-bold py-4 rounded-xl hover:bg-[#d900e3] transition shadow-neon mt-4">
                        ZAPŁAĆ {total.toFixed(2)} PLN
                    </button>
                </form>
            )}

            {step === 'processing' && (
                <div className="flex flex-col items-center justify-center h-full space-y-4">
                    <Loader className="animate-spin text-ch-secondary" size={64} />
                    <p className="text-xl font-heading animate-pulse">Przetwarzanie płatności...</p>
                </div>
            )}

            {step === 'success' && (
                <div className="flex flex-col items-center justify-center h-full space-y-4 text-center">
                    <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center shadow-neon">
                        <CheckCircle className="text-white" size={48} />
                    </div>
                    <h3 className="text-3xl font-heading text-white">Sukces!</h3>
                    <p className="text-gray-400">Twoje zamówienie zostało przyjęte do realizacji.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutModal;