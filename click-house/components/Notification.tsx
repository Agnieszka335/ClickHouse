import React, { useEffect } from 'react';
import { Notification as NotificationType } from '../types';
import { X } from 'lucide-react';

interface NotificationProps {
  notification: NotificationType;
  onClose: (id: string) => void;
}

const NotificationItem: React.FC<NotificationProps> = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  let bgClass = 'bg-ch-primary';
  if (notification.type === 'error') bgClass = 'bg-red-600';
  if (notification.type === 'success') bgClass = 'bg-ch-secondary text-ch-bg-dark';

  return (
    <div className={`${bgClass} text-white px-4 py-3 rounded-lg shadow-xl mb-3 flex items-center justify-between min-w-[300px] animate-fade-in transition-all duration-300`}>
      <span className="font-medium mr-2">
        {notification.type === 'success' && 'Sukces! '}
        {notification.type === 'error' && 'Błąd! '}
        {notification.type === 'info' && 'Info: '}
        <span className="font-normal">{notification.message}</span>
      </span>
      <button onClick={() => onClose(notification.id)} className="hover:opacity-75">
        <X size={18} />
      </button>
    </div>
  );
};

export default NotificationItem;
