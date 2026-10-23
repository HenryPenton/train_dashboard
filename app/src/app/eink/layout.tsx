import type { Metadata } from "next";
import "./eink.css";

export const metadata: Metadata = {
  title: "Travel Dashboard (e-ink)",
};

export default function EinkLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return <div className="eink-root">{children}</div>;
}
