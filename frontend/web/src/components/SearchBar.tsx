import { useState } from "react";
import { Search, X } from "lucide-react";

interface SearchBarProps {
  placeholder?: string;
  onSearch?: (query: string) => void;
  size?: string;
  className?: string;
  onClick?: () => void;
}

export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  size = "max-w-md h-fit",
  className = "",
  onClick,
}: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    if (onSearch) onSearch(value);
  };

  const clearSearch = () => {
    setQuery("");
    if (onSearch) onSearch("");
  };

  return (
    <div
      className={`flex items-center w-full ${size} bg-white rounded-lg shadow-md border border-gray-200 px-4 py-2 transition-all focus-within:ring-2 focus-within:ring-black ${className}`}
      onClick={onClick}
    >
      <Search className="text-gray-500 w-5 h-5 flex-shrink-0" />
      <input
        type="text"
        value={query}
        onChange={handleChange}
        placeholder={placeholder}
        className="flex-1 px-3 bg-transparent outline-none text-gray-700 text-sm sm:text-base"
      />
      {query && (
        <button
          onClick={clearSearch}
          className="text-gray-400 hover:text-gray-600 transition"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
}
