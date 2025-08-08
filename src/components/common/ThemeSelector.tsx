import React, { useState, useEffect } from "react";

const ThemeSelector: React.FC = () => {
  const [currentTheme, setCurrentTheme] = useState("light");
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    chrome.storage.local.get(["theme", "backgroundImage"], (result) => {
      if (result.theme) {
        setCurrentTheme(result.theme);
        applyTheme(result.theme, result.backgroundImage);
      }
    });
  }, []);

  const applyTheme = (theme: string, bgImage?: string) => {
    document.documentElement.setAttribute("data-theme", theme);
    document.body.className = `theme-${theme}`;

    if (theme === "image" && bgImage) {
      document.body.style.backgroundImage = `url(${bgImage})`;
    } else {
      document.body.style.backgroundImage = "";
    }
  };

  const handleThemeChange = (theme: string) => {
    setCurrentTheme(theme);
    setShowDropdown(false);

    chrome.storage.local.get("backgroundImage", (result) => {
      const bgImage = result.backgroundImage;
      applyTheme(theme, bgImage);
      chrome.storage.local.set({ theme });
    });
  };

  return (
    <div className="theme-container relative">
      <button
        className="theme-btn w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center"
        onClick={() => setShowDropdown(!showDropdown)}
      >
        {currentTheme === "light"
          ? "🌞"
          : currentTheme === "dark"
          ? "🌙"
          : "🖼️"}
      </button>

      {showDropdown && (
        <div className="theme-dropdown absolute right-0 top-10 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50 border border-gray-200 dark:border-gray-700 min-w-[150px]">
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            onClick={() => handleThemeChange("light")}
          >
            🌞 Light
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            onClick={() => handleThemeChange("dark")}
          >
            🌙 Dark
          </button>
          <button
            className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
            onClick={() => handleThemeChange("image")}
          >
            🖼️ Image
          </button>
        </div>
      )}
    </div>
  );
};

export default ThemeSelector;
