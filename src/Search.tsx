import "./App.css";
import React, { useMemo, useState } from "react";
import { data, dataSourceOptions } from "./data";
import {
  addSelectedSource,
  getFilteredDataSourceOptions,
  removeSelectedSource,
} from "./utils/dataSourceHandler";

type Result = {
  id: string;
  name: string;
  location: string;
  themes: string[];
  description: string;
  source: string;
  sourceLabel: string;
  date: Date;
};

type FormFields = {
  theme: string;
  location: string;
  fromDate: string;
  toDate: string;
};

const initialFormFields: FormFields = {
  theme: "",
  location: "",
  fromDate: "",
  toDate: "",
};

type SearchProps = {
  onUploadSearchClick: () => void;
};

function Search({ onUploadSearchClick }: SearchProps) {
  const [sourceQuery, setSourceQuery] = useState("");
  const [isSourceInfoOpen, setIsSourceInfoOpen] = useState(false);
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [formFields, setFormFields] = useState<FormFields>(initialFormFields);

  const filteredOptions = useMemo(() => {
    return getFilteredDataSourceOptions({
      dataSourceOptions,
      selectedSources,
      sourceQuery,
    });
  }, [selectedSources, sourceQuery]);

  // set form fields
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;

    setFormFields((currentFields) => ({
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
    console.log({ year, month, day });
    if (!year || !month || !day) {
      return null;
    }

    return new Date(year, month - 1, day);
  }

  function formatResultDate(dateValue: Date) {
    const stringDate = dateValue.toLocaleString("en-GB", {
      month: "long",
      year: "numeric",
    });
    return stringDate;
  }

  function handleAddSource(sourceOption: string) {
    setSelectedSources((currentSources) =>
      addSelectedSource(currentSources, sourceOption),
    );
    setSourceQuery("");
  }

  function handleRemoveSource(sourceOption: string) {
    setSelectedSources((currentSources) =>
      removeSelectedSource(currentSources, sourceOption),
    );
  }

  function getResults(options?: { filters?: FormFields }) {
    const filters = options?.filters ?? initialFormFields;
    const normalizedTheme = filters.theme.trim().toLowerCase();
    const normalizedLocation = filters.location.trim().toLowerCase();
    const fromDate = parseDateFilter(filters.fromDate);
    const toDate = parseDateFilter(filters.toDate);
    const hasSelectedSources = selectedSources.length > 0;

    return data.filter((item: Result) => {
      const matchesTheme =
        !normalizedTheme ||
        item.themes.some((theme) => matchesWords(theme, normalizedTheme));
      const matchesLocation =
        !normalizedLocation || matchesWords(item.location, normalizedLocation);
      const matchesDate =
        (!fromDate || item.date >= fromDate) &&
        (!toDate || item.date <= toDate);
      const matchesSource =
        !hasSelectedSources || selectedSources.includes(item.sourceLabel);

      return matchesTheme && matchesLocation && matchesDate && matchesSource;
    });
  }

  // RESULTS SUMMARY HANDLER
  function generateSummary(): React.ReactNode {
    const resultCount = results.length;
    const fromDate = formFields.fromDate
      ? new Date(formFields.fromDate).toLocaleString("en-GB", {
          month: "long",
          year: "numeric",
        })
      : null;

    // Get unique locations
    const uniqueLocations = [...new Set(results.map((r) => r.location))];
    const locationText =
      uniqueLocations.length === 1
        ? uniqueLocations[0]
        : uniqueLocations.length === 2
          ? uniqueLocations.join(" and ")
          : `${uniqueLocations.slice(0, -1).join(", ")}, and ${uniqueLocations[uniqueLocations.length - 1]}`;

    // Create a brief overview of what the results cover
    const keyThemes = results.flatMap((r) => r.themes);
    const uniqueThemes = [...new Set(keyThemes)].slice(0, 4);
    const themesText = uniqueThemes.join(", ");

    return (
      <>
        <p>
          Aviva has invested in {resultCount} project
          {resultCount !== 1 ? "s" : ""} {fromDate && "since"} {fromDate} based
          in {uniqueLocations.length} location
          {uniqueLocations.length !== 1 ? "s" : ""}: {locationText}.
        </p>
        <p>
          These results provide insights into Aviva's investments and
          initiatives on the themes of {themesText}.
        </p>
      </>
    );
  }

  function beginSearch() {
    setResults([]);
    setSearchAttempted(false);
  }

  function handleSearch() {
    const hasActiveFilters =
      Object.values(formFields).some((value) => value.trim()) ||
      selectedSources.length > 0;

    beginSearch();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);

      if (!hasActiveFilters) {
        setSearchAttempted(true);
        return;
      }

      const filtered = getResults({ filters: formFields });

      setResults(filtered);
      setSearchAttempted(true);
    }, 3000);
  }

  function handleReset() {
    setResults([]);
    setSearchAttempted(false);
    setFormFields(initialFormFields);
    setSelectedSources([]);
    setSourceQuery("");
  }

  return (
    <>
      <section className="filtered-search">
        <h3>Explore our projects by theme, location and date.</h3>
        <p className="upload-search-prompt">
          Need tailored answers for a tender? Try our{" "}
          <button
            type="button"
            className="link-button"
            onClick={onUploadSearchClick}
          >
            questionnaire search feature
          </button>
          .
        </p>
        <label htmlFor="theme">Theme</label>
        <input
          type="text"
          id="theme"
          name="theme"
          placeholder="Enter a search term, e.g. 'nature', 'biodiversity'"
          value={formFields.theme}
          onChange={handleInputChange}
        ></input>
        <label htmlFor="location">Location</label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="Enter a location, e.g. 'London', 'York'"
          value={formFields.location}
          onChange={handleInputChange}
        ></input>
        <label htmlFor="fromDate">From date</label>
        <input
          type="date"
          id="fromDate"
          name="fromDate"
          value={formFields.fromDate}
          onChange={handleInputChange}
        ></input>
        <label htmlFor="toDate">To date</label>
        <input
          type="date"
          id="toDate"
          name="toDate"
          value={formFields.toDate}
          onChange={handleInputChange}
        ></input>
        <div className="label-with-info">
          <label htmlFor="source-search">Data sources</label>
          <button
            type="button"
            className="info-icon-button"
            aria-label="Open data source information"
            aria-haspopup="dialog"
            aria-expanded={isSourceInfoOpen}
            onClick={() => setIsSourceInfoOpen(true)}
          >
            i
          </button>
        </div>
        <div className="source-search-box">
          <div className="source-chip-list">
            {selectedSources.map((sourceOption) => (
              <button
                key={sourceOption}
                type="button"
                className="source-chip"
                onClick={() => handleRemoveSource(sourceOption)}
              >
                {sourceOption}
                <span aria-hidden="true"> x</span>
              </button>
            ))}
          </div>
          <input
            id="source-search"
            type="text"
            value={sourceQuery}
            onChange={(event) => setSourceQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && filteredOptions.length > 0) {
                event.preventDefault();
                handleAddSource(filteredOptions[0]);
              }
            }}
            placeholder="Start typing to add a source"
            autoComplete="off"
          />
          {sourceQuery.trim() && filteredOptions.length > 0 && (
            <div className="source-suggestions" role="listbox">
              {filteredOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className="source-suggestion"
                  onClick={() => handleAddSource(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          )}
        </div>
        {isSourceInfoOpen && (
          <div
            className="info-modal-overlay"
            role="presentation"
            onClick={() => setIsSourceInfoOpen(false)}
          >
            <div
              className="info-modal"
              role="dialog"
              aria-modal="true"
              aria-label="Data source information"
              onClick={(event) => event.stopPropagation()}
            >
              <p>
                Available sources: aviva.com, Goodwin pack, sustainability
                sharepoint.
              </p>
              <button
                type="button"
                className="info-modal-close"
                onClick={() => setIsSourceInfoOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        )}

        <div className="search-actions">
          <button onClick={handleSearch} className="search-button">
            Search
          </button>{" "}
          <button onClick={handleReset} className="reset-button">
            Reset
          </button>
        </div>
      </section>

      <div>
        {loading && <span className="loader"></span>}

        {searchAttempted && results.length === 0 && (
          <p>No results found. Please try a different search term.</p>
        )}

        {searchAttempted && results.length > 0 && (
          <p className="results-summary">{generateSummary()}</p>
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
              <strong>Source:</strong> {item.sourceLabel}
            </p>
            <p>
              <strong>Link:</strong>{" "}
              <a href={item.source} target="_blank" rel="noopener noreferrer">
                {item.source}
              </a>
            </p>
          </div>
        ))}
      </div>
    </>
  );
}

export default Search;
