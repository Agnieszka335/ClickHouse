import React, { useState } from 'react';
import { X, Lock, Mail, Key } from 'lucide-react';
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../constants';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  onLoginFail: () => void;
}

const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ isOpen, onClose, onLoginSuccess, onLoginFail }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      onLoginSuccess();
      setEmail('');
      setPassword('');
    } else {
      onLoginFail();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-[1000] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-ch-bg-medium p-8 rounded-xl shadow-neon max-w-sm w-full relative animate-fade-in border border-ch-primary/20">
        <button onClick={onClose} className="absolute top-4 right-4 text-ch-gray hover:text-ch-primary transition">
          <X size={24} />
        </button>
        <div className="flex items-center gap-2 mb-6 justify-center">
            <div className="bg-ch-primary/10 p-3 rounded-full">
                <Lock className="text-ch-primary" size={28} />
            </div>
        </div>
        <h4 className="text-2xl font-heading text-center text-white mb-2">Panel Admina</h4>
        <p className="text-sm text-ch-gray text-center mb-6">Zaloguj się, aby zarządzać sklepem.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
             <Mail className="absolute left-3 top-3.5 text-ch-gray" size={18} />
             <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
                className="w-full p-3 pl-10 rounded-lg bg-[#181818] border border-gray-700 focus:border-ch-primary focus:ring-1 focus:ring-ch-primary transition duration-200 outline-none text-white text-sm"
             />
          </div>
          
          <div className="relative">
             <Key className="absolute left-3 top-3.5 text-ch-gray" size={18} />
             <input 
                type="password" 
                placeholder="Hasło" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
                className="w-full p-3 pl-10 rounded-lg bg-[#181818] border border-gray-700 focus:border-ch-primary focus:ring-1 focus:ring-ch-primary transition duration-200 outline-none text-white text-sm"
             />
          </div>

          <button type="submit" className="w-full bg-ch-secondary text-ch-bg-dark py-3 rounded-lg font-bold hover:bg-[#59b2cc] transition duration-300 transform active:scale-95 shadow-lg mt-2">
            ZALOGUJ SIĘ
          </button>
        </form>
        
        <p className="mt-4 text-[10px] text-center text-gray-600">
            Demo Credentials: <span className="text-gray-500">admin@demo.com / admin</span>
        </p>
      </div>
    </div>
  );
};

export default AdminLoginModal;