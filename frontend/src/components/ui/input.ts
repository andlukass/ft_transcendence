export interface InputProps {
  id?: string;
  type?: string;
  placeholder?: string;
  value?: string;
  maxLength?: number;
  label?: string;
  error?: string;
  variant?: "default" | "error";
  size?: "sm" | "md" | "lg";
  className?: string;
  onChange?: (value: string) => void;
}

export function Input({
  id,
  type = "text",
  placeholder,
  value = "",
  maxLength,
  label,
  error,
  variant = "default",
  size = "md",
  className = "",
  onChange,
}: InputProps): HTMLElement {
  const container = document.createElement("div");
  container.className = "space-y-2 flex flex-col";

  const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;

  if (label) {
    const labelEl = document.createElement("label");
    labelEl.htmlFor = inputId;
    labelEl.className = "flex text-sm font-medium text-gray-700";
    labelEl.textContent = label;
    container.appendChild(labelEl);
  }

  const input = document.createElement("input");
  input.type = type;
  input.id = inputId;
  if (placeholder) input.placeholder = placeholder;
  if (maxLength) input.maxLength = maxLength;
  input.value = value;

  const baseClasses =
    "w-full border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    default: "border-gray-300 focus:ring-gray-500 focus:border-gray-500",
    error: "border-red-500 focus:ring-red-500 focus:border-red-500",
  };

  const sizeClasses = {
    sm: "py-2 px-3 text-sm",
    md: "py-3 px-4 text-base",
    lg: "py-3 px-4 text-lg",
  };

  input.className =
    `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim();

  if (onChange) {
    input.addEventListener("input", (e) => {
      const target = e.target as HTMLInputElement;
      onChange(target.value);
    });
  }

  container.appendChild(input);

  if (error) {
    const errorEl = document.createElement("p");
    errorEl.className = "text-sm text-red-600 mt-1";
    errorEl.textContent = error;
    container.appendChild(errorEl);
  }

  return container;
}
