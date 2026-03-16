import "./App.css";
import React, { useState } from "react";
import { data } from "./data";

type Result = {
  id: string;
  name: string;
  location: string;
  themes: string[];
  description: string;
  source: string;
  date: string;
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
    <div>
      <header>
        <div className="masthead">
          <img src="/aviva-logo.svg" alt="" className="avivaLogo" />
        </div>
        <h1>Climate and nature search</h1>
        <p>
          Explore Aviva's Climate and Nature initiatives by location or theme.
        </p>
      </header>
      <main className="results-wrapper">
        <div>
          {searchAttempted && results.length === 0 && (
            <p>No results found. Please try a different search term.</p>
          )}

          {results.map((item) => (
            <div className="result" key={item.id}>
              <h2>{item.name}</h2>
              <p>
                <strong>Description:</strong> {item.description}
              </p>
              <p>
                <strong>Themes:</strong> {item.themes.join(", ")}
              </p>
              <p>
                <strong>Location:</strong> {item.location}
              </p>
              <p>
                <strong>Date:</strong> {item.date}
              </p>
              <p>
                <strong>Source:</strong>{" "}
                <a href={item.source} target="_blank" rel="noopener noreferrer">
                  {item.source}
                </a>
              </p>
            </div>
          ))}
        </div>

        <div className="search-area">
          <input
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch();
            }}
            placeholder="Enter a search term, e.g. 'norwich', 'biodiversity'"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </main>

      <footer className="w-full mt-auto pt-8 pb-4 text-center border-t border-black-300">
        <p className="text-xs text-zinc-600">A team Green Spark product</p>
      </footer>
    </div>
  );
}

export default App;
