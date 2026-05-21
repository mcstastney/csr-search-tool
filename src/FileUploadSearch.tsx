import "./App.css";
import React, { useMemo, useState } from "react";
import { data, dataSourceOptions } from "./data";

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

type Question = {
  id: string;
  text: string;
};

type FormFields = {
  location: string;
  fromDate: string;
  toDate: string;
};

const initialFormFields: FormFields = {
  location: "",
  fromDate: "",
  toDate: "",
};

// Mock questions that would be extracted from an uploaded questionnaire
const mockQuestions: Question[] = [
  {
    id: "q1",
    text: "What are the company's carbon emission reduction targets?",
  },
  {
    id: "q2",
    text: "How does the organization measure its environmental impact?",
  },
  { id: "q3", text: "What sustainability initiatives are currently in place?" },
  { id: "q4", text: "How is the company addressing climate-related risks?" },
  { id: "q5", text: "What are the key ESG metrics being tracked?" },
  { id: "q6", text: "How does the company engage with local communities?" },
  {
    id: "q7",
    text: "What is the company's approach to supply chain sustainability?",
  },
];

function FileUploadSearch() {
  const [sourceQuery, setSourceQuery] = useState("");
  const [selectedSources, setSelectedSources] = useState<string[]>([]);
  const [results, setResults] = useState<Result[]>([]);
  const [searchAttempted, setSearchAttempted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestions, setSelectedQuestions] = useState<string[]>([]);
  const [questionnaireSubmitted, setQuestionnaireSubmitted] = useState(false);
  const [formFields, setFormFields] = useState<FormFields>(initialFormFields);

  // FILE UPLOAD AND QUESTIONNAIRE HANDLERS

  // handle file upload and store the file in state
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  }

  // simulate processing uploaded file (loading wheel) and extracting questions, update state to show questions checklist
  function handleQuestionnaireSubmit() {
    if (!uploadedFile) return;

    // Simulate processing the uploaded file and extracting questions
    setLoading(true);
    setTimeout(() => {
      setQuestions(mockQuestions);
      setQuestionnaireSubmitted(true);
      setLoading(false);
    }, 300);
  }

  // handle toggling individual questions in the checklist
  function handleQuestionToggle(questionId: string) {
    setSelectedQuestions((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  }

  // handle selecting or deselecting all questions in the checklist
  function handleSelectAllQuestions() {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(questions.map((q) => q.id));
    }
  }

  function getThemesFromSelectedQuestions(selectedQuestionIds: string[]) {
    // Map question IDs to themes (this is a mock mapping for demonstration)
    const questionThemeMap: { [key: string]: string[] } = {
      q1: ["carbon reduction", "climate change"],
      q2: ["environmental impact", "sustainability metrics"],
      q3: [
        "sustainability initiatives",
        "community engagement",
        "biodiversity",
        "habitat restoration",
      ],
      q4: ["climate risks", "resilience", "flooding", "drought"],
      q5: ["ESG metrics", "reporting"],
      q6: ["community engagement", "social impact"],
      q7: ["supply chain sustainability", "ethical sourcing"],
    };

    const selectedThemes = new Set<string>();
    selectedQuestionIds.forEach((id) => {
      const themes = questionThemeMap[id];
      if (themes) {
        themes.forEach((theme) => selectedThemes.add(theme));
      }
    });

    return Array.from(selectedThemes);
  }

  // DATA SOURCE HANDLERS
  // filter available data sources for the suggestions dropdown and selected sources based on user input and excluding already selected sources
  const filteredOptions = useMemo(() => {
    const normalizedQuery = sourceQuery.trim().toLowerCase();

    return dataSourceOptions.filter((option) => {
      const isAlreadySelected = selectedSources.includes(option);
      // if no source, query all options. If source, show options that match the query and aren't already selected
      const matchesQuery =
        !normalizedQuery || option.toLowerCase().includes(normalizedQuery);

      return !isAlreadySelected && matchesQuery;
    });
  }, [selectedSources, sourceQuery]);

  // helper to add selected source to the UI
  function handleAddSource(sourceOption: string) {
    setSelectedSources((currentSources) => [...currentSources, sourceOption]);
    setSourceQuery("");
  }

  // helper to remove selected source from the UI
  function handleRemoveSource(sourceOption: string) {
    setSelectedSources((currentSources) =>
      currentSources.filter((currentSource) => currentSource !== sourceOption),
    );
  }

  // FORM FIELD HANDLERS
  // dynamic input handler for form fields (location, fromDate, toDate)
  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormFields((currentFields) => ({
      ...currentFields,
      [name]: value,
    }));
  }

  // helper function to check if input value contains all words in a query (case-insensitive)
  function matchesWords(value: string, query: string) {
    const queryWords = query.trim().toLowerCase().split(/\s+/);
    const normalizedValue = value.toLowerCase();
    return queryWords.every((word) => normalizedValue.includes(word));
  }

  // convert date string input into a Number
  function parseDateFilter(dateValue: string) {
    if (!dateValue) {
      return null;
    }
    const [year, month, day] = dateValue.split("-").map(Number);
    if (!year || !month || !day) {
      return null;
    }
    // Jan is 0 index in JS but input month is 1 index, hence month - 1
    return new Date(year, month - 1, day);
  }

  // convert date into a readable format for UI, e.g. "June 2024"
  function formatResultDate(dateValue: Date) {
    return dateValue.toLocaleString("en-GB", {
      month: "long",
      year: "numeric",
    });
  }

  // SEARCH HANDLERS
  // helper to reset results and search state when performing a new search
  function beginSearch() {
    setResults([]);
    setSearchAttempted(false);
  }

  // main search function - filter data based on selected sources, form fields, and return results that match all criteria
  function handleSearch() {
    const hasSelectedSources = selectedSources.length > 0;
    const selectedThemes = getThemesFromSelectedQuestions(selectedQuestions);
    const locationQueries = formFields.location
      .split(",")
      .map((locationItem) => locationItem.trim().toLowerCase())
      .filter(Boolean);
    const fromDate = parseDateFilter(formFields.fromDate);
    const toDate = parseDateFilter(formFields.toDate);

    beginSearch();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (!hasSelectedSources) {
        setSearchAttempted(true);
        return;
      }

      const filtered = data.filter((item: Result) => {
        const matchesSource = selectedSources.includes(item.sourceLabel);

        const matchesLocation =
          locationQueries.length === 0 ||
          locationQueries.some((query) => matchesWords(item.location, query));
        const matchesDate =
          (!fromDate || item.date >= fromDate) &&
          (!toDate || item.date <= toDate);

        return (
          matchesSource &&
          selectedThemes.length > 0 &&
          matchesLocation &&
          matchesDate
        );
      });

      setResults(filtered);
      setSearchAttempted(true);
    }, 300);
  }

  // RESULTS SUMMARY HANDLER
  function generateSummary(): React.ReactNode {
    const selectedCount = selectedQuestions.length;
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
          {resultCount !== 1 ? "s" : ""} {fromDate && "since"} {fromDate} that
          address your selected question{selectedCount !== 1 ? "s" : ""} from
          this tender.
        </p>
        <p>
          The project{resultCount !== 1 ? "s" : ""} span{" "}
          {uniqueLocations.length} location
          {uniqueLocations.length !== 1 ? "s" : ""}: {locationText}. These
          results provide insights into Aviva's investments and initiatives
          related to the themes of {themesText}.
        </p>
      </>
    );
  }

  // Initial upload state - show file upload and submit button
  if (!questionnaireSubmitted) {
    return (
      <section className="source-search-panel">
        <div className="source-field">
          <h3>
            Upload a questionnaire and choose the questions you want to include
            in your search.
          </h3>
          <label htmlFor="file" className="source-search-label">
            File upload
          </label>

          <input
            type="file"
            name="file"
            id="file"
            onChange={handleFileChange}
            accept=".pdf,.doc,.docx,.txt,.xlsx,.xls,.csv"
          />
        </div>

        {loading && <span className="loader"></span>}

        <button
          onClick={handleQuestionnaireSubmit}
          className="search-button"
          disabled={!uploadedFile || loading}
        >
          Submit
        </button>
      </section>
    );
  }

  // After questionnaire submitted - show questions checklist, data sources, and search
  return (
    <section className="source-search-panel">
      <div className="source-field">
        <label className="source-search-label">
          Select questions to answer:
        </label>
        <div className="question-list">
          <label className="question-item select-all">
            <input
              type="checkbox"
              checked={selectedQuestions.length === questions.length}
              onChange={handleSelectAllQuestions}
            />
            <span>Select all questions</span>
          </label>
          {questions.map((question) => (
            <label key={question.id} className="question-item">
              <input
                type="checkbox"
                checked={selectedQuestions.includes(question.id)}
                onChange={() => handleQuestionToggle(question.id)}
              />
              <span>{question.text}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="source-field">
        <label htmlFor="source-search" className="source-search-label">
          Data sources to include in search:
        </label>
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
            className="source-search-input"
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
        <p className="source-search-help">
          Available sources: aviva.com, Goodwin pack, sustainability sharepoint
        </p>
      </div>

      <div className="source-field">
        <label htmlFor="location" className="source-search-label">
          Location
        </label>
        <input
          type="text"
          id="location"
          name="location"
          placeholder="Enter a location, e.g. 'London', 'York'"
          value={formFields.location}
          onChange={handleInputChange}
        />
      </div>

      <div className="source-field">
        <label htmlFor="fromDate" className="source-search-label">
          From date
        </label>
        <input
          type="date"
          id="fromDate"
          name="fromDate"
          value={formFields.fromDate}
          onChange={handleInputChange}
        />
      </div>

      <div className="source-field">
        <label htmlFor="toDate" className="source-search-label">
          To date
        </label>
        <input
          type="date"
          id="toDate"
          name="toDate"
          value={formFields.toDate}
          onChange={handleInputChange}
        />
      </div>

      <button onClick={handleSearch} className="search-button">
        Search
      </button>

      <div>
        {loading && <span className="loader"></span>}

        {searchAttempted && results.length === 0 && (
          <p>No results found. Try selecting one or more data sources.</p>
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
    </section>
  );
}

export default FileUploadSearch;
