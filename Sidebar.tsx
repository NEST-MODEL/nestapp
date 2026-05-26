'use client';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <aside className="w-[80px] bg-[#111111] border-r border-[#1A1A1A] flex flex-col items-center py-6 gap-4">
      <div className="w-12 h-12 bg-accent rounded-2xl flex items-center justify-center font-bold text-black mb-4">N</div>
      
      <Link href="/" className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center hover:bg-accent transition-colors">🏠</Link>
      <Link href="/servers" className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center hover:bg-accent transition-colors">💬</Link>
      <Link href="/profile" className="w-12 h-12 bg-[#1A1A1A] rounded-2xl flex items-center justify-center hover:bg-accent transition-colors mt-auto">👤</Link>
    </aside>
  );
}
