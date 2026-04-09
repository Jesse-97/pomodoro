import "./Navigation.css";

export default function Navigation({ activeTab, setActiveTab, theme, onToggleTheme }) {
  const tabs = [
    { id: "focus", label: "Focus" },
    { id: "games", label: "Games" },
    { id: "calendar", label: "Calendar" },
  ];

  return (
    <nav className="navigation">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`nav-tab ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}

      <button
        className="theme-toggle"
        onClick={onToggleTheme}
        aria-label="Toggle color theme"
        title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
      >
        {theme === "light" ? "Dark" : "Light"}
      </button>
    </nav>
  );
}
