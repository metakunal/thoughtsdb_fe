import PinLogin from "@/components/PinLogin";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0c0c0c] flex flex-col items-center justify-center gap-8">
      <div className="text-center">
        <span className="text-4xl">◈</span>
        <h1 className="font-serif text-2xl text-[#e2d9c8] mt-4 mb-2">Second Brain</h1>
        <p className="font-mono text-xs text-[#444] tracking-widest uppercase">
          Your personal knowledge vault
        </p>
      </div>

      <div className="border border-[#1e1e1e] p-8 flex flex-col items-center gap-4 w-80">
        <p className="font-mono text-xs text-[#555] text-center leading-relaxed">
          Send <span className="text-[#e2d9c8]">/pin</span> to your Telegram bot to get a login code
        </p>
        <PinLogin />
      </div>
    </div>
  );
}