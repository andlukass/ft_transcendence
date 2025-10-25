import type React from "react";

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> {
  label?: string;
  error?: string;
  variant?: "default" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Input({
  label,
  error,
  variant = "default",
  size = "md",
  className = "",
  id,
  type = "text",
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  const baseClasses =
    "w-full border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    default:
      "border-gray-300 focus:ring-gray-500 focus:border-gray-500 focus:!ring-gray-500 focus:!border-gray-500",
    error: "border-red-500 focus:ring-red-500 focus:border-red-500",
  };

  const sizeClasses = {
    sm: "py-2 px-3 text-sm",
    md: "py-3 px-4 text-base",
    lg: "py-3 px-4 text-lg",
  };

  const combinedClasses =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  return (
    <div className="space-y-2 flex flex-col">
      {label && (
        <label htmlFor={inputId} className="flex text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <input type={type} id={inputId} className={combinedClasses} {...props} />
      {error && <p className="text-sm text-red-600 mt-1">{error}</p>}
    </div>
  );
}
