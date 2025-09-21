export const Button = ({
  children,
  className,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}) => {
  disabled = disabled || false;
  return (
    <button
      className={`px-4 py-2 cursor-pointer rounded-lg shadow-md ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};
