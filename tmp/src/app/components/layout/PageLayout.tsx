import React from "react";
import Link from "next/link";

interface PageLayoutProps {
  title: string;
  children: React.ReactNode;
  showNavigation?: boolean;
  lastRefreshTimeStamp?: string;
}

export default function PageLayout({
  title,
  children,
  showNavigation = true,
  lastRefreshTimeStamp,
}: PageLayoutProps) {
  const lastRefreshed = lastRefreshTimeStamp
    ? new Date(lastRefreshTimeStamp).toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
    : null;

  return (
    <main className="w-full min-h-screen p-8 bg-[#181818] font-mono text-[#f8f8f2] relative">
      <h1
        className="text-center text-cyan-300 text-4xl font-bold tracking-widest mb-10 drop-shadow-[0_0_2px_white,0_0_8px_#00ffe7] font-mono border-b-4 border-yellow-200 pb-4"
        style={{ letterSpacing: "0.15em" }}
      >
        {title}
      </h1>

      {children}

      {lastRefreshed && (
        <div className="mt-10 text-center text-[#b0b0b0] text-sm">
          Last refreshed: {lastRefreshed}
        </div>
      )}

      {showNavigation && (
        <div className="w-full text-center mt-10 flex flex-col items-center gap-2">
          <Link
            href="/"
            className="text-green-300 hover:underline text-lg font-bold"
          >
            Home
          </Link>
          <Link
            href="/settings"
            className="text-cyan-300 hover:underline text-lg font-bold"
          >
            Settings
          </Link>
          <Link
            href="/schedules"
            className="text-yellow-300 hover:underline text-lg font-bold"
          >
            Schedules
          </Link>
        </div>
      )}
    </main>
  );
}
