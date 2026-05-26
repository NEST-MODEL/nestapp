export default function PostCard({ content, author }: { content: string, author: string }) {
  return (
    <div className="bg-[#1A1A1A] p-5 rounded-2xl border border-white/5 hover:border-accent/30 transition-all">
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-accent/20"></div>
        <span className="font-semibold">{author}</span>
      </div>
      <p className="text-gray-300 leading-relaxed">{content}</p>
      <div className="mt-4 flex gap-4 text-sm text-gray-500">
        <button className="hover:text-accent">❤️ Нравится</button>
        <button className="hover:text-accent">💬 Ответить</button>
      </div>
    </div>
  );
}
