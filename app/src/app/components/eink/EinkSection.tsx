import React from "react";

type EinkSectionProps = {
  title: string;
  children: React.ReactNode;
};

export function EinkSection({ title, children }: EinkSectionProps) {
  return (
    <section className="eink-section">
      <h2 className="eink-section-title">{title}</h2>
      {children}
    </section>
  );
}

export function EinkMessage({ children }: { children: React.ReactNode }) {
  return <p className="eink-message">{children}</p>;
}
