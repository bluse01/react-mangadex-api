import { useState } from "react";

interface SearchbarProps {
  onSearch: (title: string) => void;
}

export default function SearchBar({ onSearch }: SearchbarProps) {
  const [inputValue, setInputValue] = useState<string>("");

  return (
    <div className="search-container">
      <form
        onSubmit={(e) => {
          e.preventDefault();

          onSearch(inputValue);
        }}
      >
        <input
          type="text"
          placeholder="search..."
          onChange={(e) => setInputValue(e.target.value)}
          value={inputValue}
        />
        <button onClick={() => onSearch(inputValue)}>
          <i className="fa-solid fa-magnifying-glass"></i>
        </button>
      </form>
    </div>
  );
}
