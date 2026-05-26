import PostCard from "@/components/PostCard";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto py-10 space-y-6">
      <h1 className="text-3xl font-bold mb-8">Лента</h1>
      <PostCard author="Admin" content="Добро пожаловать в NEST! Это первая версия нашей платформы." />
      <PostCard author="Игрок №1" content="Сервер подняли, заходите играть!" />
    </div>
  );
}
