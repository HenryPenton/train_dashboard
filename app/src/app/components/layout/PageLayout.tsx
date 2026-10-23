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
    <main className="w-full min-h-screen p-8 bg-page font-mono text-fg relative">
      <h1
        className="text-center text-accent text-4xl font-bold tracking-widest mb-10 title-glow font-mono border-b-4 border-accent-2-soft pb-4"
        style={{ letterSpacing: "0.15em" }}
      >
        {title}
      </h1>

      {children}

      {lastRefreshed && (
        <div className="mt-10 text-center text-subtle text-sm">
          Last refreshed: {lastRefreshed}
        </div>
      )}

      {showNavigation && (
        <div className="w-full text-center mt-10 flex flex-col items-center gap-2">
          <Link
            href="/"
            className="text-accent-3 hover:underline text-lg font-bold"
          >
            Home
          </Link>
          <Link
            href="/settings"
            className="text-accent hover:underline text-lg font-bold"
          >
            Settings
          </Link>
          <Link
            href="/schedules"
            className="text-accent-2 hover:underline text-lg font-bold"
          >
            Schedules
          </Link>
          <Link
            href="/eink"
            className="text-gray-300 hover:underline text-lg font-bold"
          >
            E-ink view
          </Link>
        </div>
      )}
    </main>
  );
}
