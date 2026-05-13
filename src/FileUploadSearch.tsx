import "./App.css";
import { useMemo, useState } from "react";
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

  function formatResultDate(dateValue: Date) {
    return dateValue.toLocaleString("en-GB", {
      month: "long",
      year: "numeric",
    });
  }

  const filteredOptions = useMemo(() => {
    const normalizedQuery = sourceQuery.trim().toLowerCase();

    return dataSourceOptions.filter((option) => {
      const isAlreadySelected = selectedSources.includes(option);
      const matchesQuery =
        !normalizedQuery || option.toLowerCase().includes(normalizedQuery);

      return !isAlreadySelected && matchesQuery;
    });
  }, [selectedSources, sourceQuery]);

  function beginSearch() {
    setResults([]);
    setSearchAttempted(false);
  }

  function handleAddSource(sourceOption: string) {
    setSelectedSources((currentSources) => [...currentSources, sourceOption]);
    setSourceQuery("");
  }

  function handleRemoveSource(sourceOption: string) {
    setSelectedSources((currentSources) =>
      currentSources.filter((currentSource) => currentSource !== sourceOption),
    );
  }

  function handleSearch() {
    const hasSelectedSources = selectedSources.length > 0;

    beginSearch();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);

      if (!hasSelectedSources) {
        setSearchAttempted(true);
        return;
      }

      const filtered = data.filter((item: Result) =>
        selectedSources.includes(item.sourceLabel),
      );

      setResults(filtered);
      setSearchAttempted(true);
    }, 300);
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setUploadedFile(file);
  }

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

  function handleQuestionToggle(questionId: string) {
    setSelectedQuestions((current) =>
      current.includes(questionId)
        ? current.filter((id) => id !== questionId)
        : [...current, questionId],
    );
  }

  function handleSelectAllQuestions() {
    if (selectedQuestions.length === questions.length) {
      setSelectedQuestions([]);
    } else {
      setSelectedQuestions(questions.map((q) => q.id));
    }
  }

  function generateSummary(): string {
    const selectedCount = selectedQuestions.length;
    const resultCount = results.length;

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

    return `Aviva has invested in ${resultCount} project${resultCount !== 1 ? "s" : ""} addressing your selected question${selectedCount !== 1 ? "s" : ""} about sustainability and community metrics. These results span ${uniqueLocations.length} location${uniqueLocations.length !== 1 ? "s" : ""}: ${locationText}. Key themes covered include ${themesText}.`;
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
          Suggested sources: aviva.com, Goodwin pack, sustainability sharepoint
        </p>
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
