import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, AlertCircle, Info, X } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none px-4">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded bg-luxe-dark text-luxe-bg text-xs font-medium shadow-dropdown"
          >
            <div className="flex items-center gap-2">
              {toast.type === 'success' ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : toast.type === 'error' ? (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              ) : (
                <Info className="w-3.5 h-3.5 text-luxe-accent shrink-0" />
              )}
              <span>{toast.title}</span>
            </div>
            <button onClick={() => removeToast(toast.id)} className="text-luxe-muted hover:text-luxe-bg">
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
