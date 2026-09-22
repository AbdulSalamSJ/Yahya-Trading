import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export function Toast({ message }) {
  if (!message) return null;

  return (
    <div className="fixed top-20 right-4 sm:right-6 z-50 animate-bounce-short">
      <div className="flex items-center gap-2.5 px-4 py-3 rounded-xl bg-[#3E2723] text-[#F5EFEA] dark:bg-[#FDF8F5] dark:text-[#3E2723] shadow-2xl border border-[#795548]/40 text-xs font-medium">
        <CheckCircle2 size={16} className="text-[#388E3C] flex-shrink-0" />
        <span>{message}</span>
      </div>
    </div>
  );
}
