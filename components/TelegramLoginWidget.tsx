"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function TelegramLoginWidget() {
  const ref = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    if (!ref.current) return;

    ref.current.innerHTML = "";

    // Step 1: Define callback FIRST as an inline script
    // This must exist on window before the Telegram widget script loads
    const callbackScript = document.createElement("script");
    callbackScript.innerHTML = `
      function onTelegramAuth(user) {
        fetch("/api/auth/telegram", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(user)
        })
        .then(function(res) {
          if (res.ok) {
            window.location.href = "/";
          } else {
            console.error("Auth failed", res.status);
          }
        })
        .catch(function(err) {
          console.error("Auth error", err);
        });
      }
    `;
    ref.current.appendChild(callbackScript);

    // Step 2: Load Telegram widget AFTER callback is defined
    const widgetScript = document.createElement("script");
    widgetScript.src = "https://telegram.org/js/telegram-widget.js?22";
    widgetScript.setAttribute("data-telegram-login", process.env.NEXT_PUBLIC_BOT_USERNAME!);
    widgetScript.setAttribute("data-size", "large");
    widgetScript.setAttribute("data-onauth", "onTelegramAuth(user)");
    widgetScript.setAttribute("data-request-access", "write");
    widgetScript.async = true;

    widgetScript.onload = () => {
      console.log("Telegram widget loaded successfully");
    };

    widgetScript.onerror = (err) => {
      console.error("Telegram widget failed to load", err);
    };

    ref.current.appendChild(widgetScript);

    return () => {
      if (typeof window !== "undefined") {
        delete (window as any).onTelegramAuth;
      }
    };
  }, []);

  return <div ref={ref} />;
}