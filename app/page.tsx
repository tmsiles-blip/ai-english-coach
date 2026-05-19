import VoiceChat from "./VoiceChat";

export default function Home() {
  return (
    <main className="p-10">
      <h1 className="text-4xl font-bold mb-6">
        AI English Coach
      </h1>

      <VoiceChat />
    </main>
  );
}