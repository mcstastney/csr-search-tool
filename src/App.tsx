import "./App.css";
import { useState } from "react";
import Search from "./Search";
import FileUploadSearch from "./FileUploadSearch";

function App() {
  const [showStandardSearch, setShowStandardSearch] = useState(true);
  const [showUploadSearch, setShowUploadSearch] = useState(false);

  function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleToggleSearch() {
    if (showUploadSearch) {
      setShowStandardSearch(true);
      setShowUploadSearch(false);
    } else {
      setShowUploadSearch(true);
      setShowStandardSearch(false);
    }
    scrollToTop();
  }

  function handleLogoClick() {
    setShowStandardSearch(true);
    setShowUploadSearch(false);
    scrollToTop();
  }

  return (
    <div>
      <header>
        <div className="masthead">
          <button onClick={handleLogoClick} className="logo-button">
            <img
              src="/aviva-logo.svg"
              alt="Aviva homepage"
              className="avivaLogo"
            />
          </button>
          <button onClick={handleToggleSearch} className="questionnaire-search">
            {showUploadSearch ? "<- Back to search" : "Upload questionnaire"}
          </button>
        </div>
        <div className="header-content">
          <div className="header-copy">
            <h1>Sustainability Impact Explorer</h1>
            <h2>Unearth Aviva's climate and nature initiatives</h2>
          </div>
        </div>
      </header>
      <main className="results-wrapper">
        {showStandardSearch && (
          <Search onUploadSearchClick={handleToggleSearch} />
        )}
        {showUploadSearch && <FileUploadSearch />}
      </main>

      <footer className="w-full mt-auto pt-8 pb-4 text-center border-t border-black-300">
        <p className="text-xs text-zinc-600">A team Green Spark product</p>
      </footer>
    </div>
  );
}

export default App;
