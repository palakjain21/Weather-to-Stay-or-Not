'use client';

import { useState } from "react";
import SearchInput from "../components/SearchInput";

export default function Home() {
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query: string) => {
    console.log("Searching for:", query);
  };

  const handleClear = () => {
    setSearchResults([]);
    setSearchQuery("");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">

        <SearchInput
          placeholder="Search properties..."
          value={searchQuery}
          onChange={setSearchQuery}
          onSearch={handleSearch}
          onClear={handleClear}
          className="mb-8 text-gray-700"
        />

        {searchResults.length > 0 && (
          <div>
            <div className="grid gap-4">
              {searchResults.map((result, index) => (
                <div key={index}>
                  {result}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}