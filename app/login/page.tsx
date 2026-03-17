import PinLogin from "@/components/PinLogin";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center p-6 selection:bg-white/10">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-white/[0.02] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-white/[0.02] blur-[120px] rounded-full" />
      </div>

      <div className="w-full max-w-sm flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-white to-zinc-500 flex items-center justify-center shadow-2xl shadow-white/20">
             <span className="text-[#0a0a0a] font-bold text-2xl italic">B</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white mb-2">Second Brain</h1>
            <p className="text-zinc-500 text-sm font-medium">Your personal knowledge vault</p>
          </div>
        </div>

        <div className="w-full bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 backdrop-blur-xl shadow-2xl flex flex-col gap-8">
          <div className="flex flex-col gap-2 text-center">
            <p className="text-sm font-medium text-zinc-300">Authentication Required</p>
            <p className="text-xs text-zinc-500 leading-relaxed">
              Send <code className="text-white px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono text-[11px]">/pin</code> to your Telegram bot to get a login code
            </p>
          </div>
          <PinLogin />
        </div>

        <p className="text-[10px] text-zinc-700 font-mono tracking-widest uppercase">
          &copy; 2026 Thinking Tool
        </p>
      </div>
    </div>
  );
}
