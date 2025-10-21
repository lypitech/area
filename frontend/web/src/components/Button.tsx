export const Button = ({
  type = "button",
  children,
  className,
  onClick,
  disabled,
}: {
  type?: "submit" | "reset" | "button";
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  disabled = disabled || false;
  return (
    <button
      type={type}
      className={`px-4 py-2 cursor-pointer rounded-lg shadow-md ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
