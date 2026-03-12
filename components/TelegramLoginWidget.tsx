"use client";

import { useEffect, useRef } from "react";

export default function TelegramLoginWidget() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    // Clean up any existing script on re-render
    ref.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", process.env.NEXT_PUBLIC_BOT_USERNAME!);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", "https://thoughtsdb-fe.vercel.app/api/auth/telegram");
    script.setAttribute("data-request-access", "write");
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} />;
}