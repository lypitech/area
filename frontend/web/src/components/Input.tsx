import Icon from "./icons/icons";

const Input = ({
  iconName,
  iconClass,
  placeholder,
  inputClass,
  required,
  value,
  onChange,
  ...props
}: {
  iconName?: string;
  iconClass?: string;
  placeholder?: string;
  inputClass?: string;
  required?: boolean;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => {
  required = required || false;
  return (
    <div className="relative">
      <input
        className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black placeholder:opacity-50 ${inputClass}`}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        {...props}
      />
      {iconName && (
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <Icon
            iconName={iconName}
            iconClass={iconClass ? iconClass : "w-5 h-5"}
          />
        </div>
      )}
    </div>
  );
};

export default Input;
