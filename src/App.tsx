import "./App.css";
import React, { useState } from "react";
import { data } from "./data";

type Result = {
  id: string;
  name: string;
  location: string;
  themes: string[];
  description: string;
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function handleSearch() {
    if (!searchTerm) {
      setResults([]);
      setSearchAttempted(true);
      return;
    }
    const searchTermWords = searchTerm.trim().toLowerCase().split(/\s+/);
    const filtered = data.filter((item: Result) =>
      searchTermWords.every(
        (word) =>
          item.themes.some((theme) => theme.toLowerCase().includes(word)) ||
          item.location.toLowerCase().includes(word),
      ),
    );

    setResults(filtered);
    setSearchAttempted(true);
    setSearchTerm("");
  }

  return (
    <>
      <header className="header">
        <h1>Sustainability Search</h1>
        <img
          src="/bot-search-icon.png"
          alt="Sustainability bot"
          className="botIcon"
        />
        <p>
          Explore Aviva's Climate and Nature initiatives by location or theme.
        </p>
        <div>
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            placeholder="Enter a search term, e.g. 'norwich', 'biodiversity'"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>
      <main>
        <div>
          {searchAttempted && results.length === 0 && (
            <p>No results found. Please try a different search term.</p>
          )}

          {results.map((item) => (
            <div className="resultsDiv" key={item.id}>
              <h3>{item.name}</h3>
              <p>
                <strong>Description:</strong> {item.description}
              </p>
              <p>
                <strong>Themes:</strong> {item.themes.join(", ")}
              </p>
              <p>
                <strong>Location:</strong> {item.location}
              </p>
            </div>
          ))}
        </div>

        <footer className="w-full mt-auto pt-8 pb-4 text-center border-t border-black-300">
          <p className="text-xs text-zinc-600">A Green Spark product</p>
        </footer>
      </main>
    </>
  );
}

export default App;
