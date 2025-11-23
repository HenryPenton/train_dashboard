import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  variant?: "primary" | "secondary" | "success" | "danger" | "info";
  className?: string;
  disabled?: boolean;
  icon?: React.ReactNode;
}

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  icon,
}: ButtonProps) {
  const baseStyles =
    "px-4 py-2 rounded font-semibold transition-colors flex items-center gap-2";

  const variantStyles = {
    primary: "bg-cyan-600 hover:bg-cyan-700 text-white border border-cyan-500",
    secondary:
      "bg-gray-600 hover:bg-gray-700 text-white border border-gray-500",
    success:
      "bg-green-600 hover:bg-green-700 text-white border border-green-500",
    danger: "bg-red-600 hover:bg-red-700 text-white border border-red-500",
    info: "bg-blue-600 hover:bg-blue-700 text-white border border-blue-500",
  };

  const disabledStyles = "opacity-50 cursor-not-allowed";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles[variant]} ${disabled ? disabledStyles : ""} ${className}`}
    >
      {icon}
      {children}
    </button>
  );
}
