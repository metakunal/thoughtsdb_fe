"use client";

import { useEffect, useRef } from "react";

export default function TelegramLoginWidget() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log("Bot username:", process.env.NEXT_PUBLIC_BOT_USERNAME);
    console.log("Auth URL:", `${window.location.origin}/api/auth/telegram`);
    if (!ref.current) return;

    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", process.env.NEXT_PUBLIC_BOT_USERNAME!);
    script.setAttribute("data-size", "large");
    script.setAttribute("data-auth-url", `${window.location.origin}/api/auth/telegram`);
    script.setAttribute("data-request-access", "write");
    script.async = true;

    ref.current.appendChild(script);
  }, []);

  return <div ref={ref} />;
}