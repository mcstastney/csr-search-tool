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
  date: Date;
};

type FilterFields = {
  theme: string;
  location: string;
  clientWebsite: string;
  fromDate: string;
  toDate: string;
};

const initialFilterFields: FilterFields = {
  theme: "",
  location: "",
  clientWebsite: "",
  fromDate: "",
  toDate: "",
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState<Result[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showStandardSearch, setShowStandardSearch] = useState(true);
  const [showFilteredSearch, setShowFilteredSearch] = useState(false);
  const [filterFields, setFilterFields] =
    useState<FilterFields>(initialFilterFields);

  function handleStandardInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearchTerm(e.target.value);
  }

  function handleFilteredInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFilterFields((currentFields) => ({
      ...currentFields,
      [name]: value,
    }));
  }

  function matchesWords(value: string, query: string) {
    const queryWords = query.trim().toLowerCase().split(/\s+/);
    const normalizedValue = value.toLowerCase();

    return queryWords.every((word) => normalizedValue.includes(word));
  }

  function parseDateFilter(dateValue: string) {
    if (!dateValue) {
      return null;
    }

    const [year, month, day] = dateValue.split("-").map(Number);

    if (!year || !month || !day) {
      return null;
    }

    return new Date(year, month - 1, day);
  }

  function formatResultDate(dateValue: Date) {
    return dateValue.toLocaleString("en-GB", {
      month: "long",
      year: "numeric",
    });
  }

  function getResults(options?: {
    standardSearchTerm?: string;
    advancedFilters?: FilterFields;
  }) {
    const standardSearchTerm =
      options?.standardSearchTerm?.trim().toLowerCase() ?? "";
    const advancedFilters = options?.advancedFilters ?? initialFilterFields;
    const normalizedTheme = advancedFilters.theme.trim().toLowerCase();
    const normalizedLocation = advancedFilters.location.trim().toLowerCase();
    const normalizedClientWebsite = advancedFilters.clientWebsite
      .trim()
      .toLowerCase();
    const fromDate = parseDateFilter(advancedFilters.fromDate);
    const toDate = parseDateFilter(advancedFilters.toDate);

    return data.filter((item: Result) => {
      const matchesStandardSearch =
        !standardSearchTerm ||
        item.themes.some((theme) => matchesWords(theme, standardSearchTerm)) ||
        matchesWords(item.location, standardSearchTerm);
      const matchesTheme =
        !normalizedTheme ||
        item.themes.some((theme) => matchesWords(theme, normalizedTheme));
      const matchesLocation =
        !normalizedLocation || matchesWords(item.location, normalizedLocation);
      const matchesClientWebsite =
        !normalizedClientWebsite ||
        item.source.toLowerCase().includes(normalizedClientWebsite);
      const matchesDate =
        (!fromDate || item.date >= fromDate) &&
        (!toDate || item.date <= toDate);

      return (
        matchesStandardSearch &&
        matchesTheme &&
        matchesLocation &&
        matchesClientWebsite &&
        matchesDate
      );
    });
  }

  function handleSearch() {
    if (!searchTerm) {
      setResults([]);
      setSearchAttempted(true);
      return;
    }

    const standard = getResults({ standardSearchTerm: searchTerm });

    setResults(standard);
    setSearchAttempted(true);
    setSearchTerm("");
  }

  function handleAdvancedSearch() {
    const hasActiveFilters = Object.values(filterFields).some((value) =>
      value.trim(),
    );

    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (!hasActiveFilters) {
        setResults([]);
        setSearchAttempted(true);
        return;
      }

      const filtered = getResults({ advancedFilters: filterFields });

      setResults(filtered);
      setSearchAttempted(true);
    }, 3000);
  }

  function handleReset() {
    setResults([]);
    setSearchAttempted(false);
    setSearchTerm("");
    setFilterFields(initialFilterFields);
  }

  function handleFilteredSearch() {
    setShowFilteredSearch(!showFilteredSearch);
    setShowStandardSearch(!showStandardSearch);
  }

  function handleUpload() {
    console.log("File uploaded");
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
        <div className="results-top-anchor" />

        {showStandardSearch && (
          <section className="search-area">
            <input
              type="text"
              value={searchTerm}
              onChange={handleStandardInputChange}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              placeholder="Enter a search term, e.g. 'norwich', 'biodiversity'"
            />
            <div className="search-actions">
              <button onClick={handleSearch} className="search-button">
                Search
              </button>
              <button onClick={handleReset} className="reset-button">
                Reset
              </button>
            </div>
          </section>
        )}
        <button className="filter-button" onClick={handleFilteredSearch}>
          {showFilteredSearch ? (
            "Standard search"
          ) : (
            <>
              Advanced search
              <img src="/filter.png" alt="" className="filter-icon" />
            </>
          )}
        </button>
        {showFilteredSearch ? (
          <section className="filtered-search">
            <label htmlFor="theme">Theme</label>
            <input
              type="text"
              id="theme"
              name="theme"
              value={filterFields.theme}
              onChange={handleFilteredInputChange}
            ></input>
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={filterFields.location}
              onChange={handleFilteredInputChange}
            ></input>
            <label htmlFor="clientwebsite">Client website</label>
            <input
              type="url"
              id="clientwebsite"
              name="clientWebsite"
              value={filterFields.clientWebsite}
              onChange={handleFilteredInputChange}
            ></input>
            <label htmlFor="fromDate">From date</label>
            <input
              type="date"
              id="fromDate"
              name="fromDate"
              value={filterFields.fromDate}
              onChange={handleFilteredInputChange}
            ></input>
            <label htmlFor="toDate">To date</label>
            <input
              type="date"
              id="toDate"
              name="toDate"
              value={filterFields.toDate}
              onChange={handleFilteredInputChange}
            ></input>
            <label htmlFor="file">File upload</label>
            <input
              type="file"
              name="file"
              id="file"
              onChange={handleUpload}
            ></input>
            <button onClick={handleAdvancedSearch} className="search-button">
              Search
            </button>
          </section>
        ) : null}
        <div>
          {loading && <span className="loader"></span>}

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
                <strong>Date:</strong> {formatResultDate(item.date)}
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
      </main>

      <footer className="w-full mt-auto pt-8 pb-4 text-center border-t border-black-300">
        <p className="text-xs text-zinc-600">A team Green Spark product</p>
      </footer>
    </div>
  );
}

export default App;
