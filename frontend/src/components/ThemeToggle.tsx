// src/components/ThemeToggle.tsx
import { useEffect, useState } from "react";
import "../ThemeToggle.css";

export default function ThemeToggle() {
  console.log("ThemeToggle rendered");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "light" ? false : true;
  });

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "light";
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <button
      className="theme-toggle"
      onClick={() => setDarkMode(!darkMode)}
      aria-label="Toggle Dark Mode"
    >
      {darkMode ? "🌙" : "☀️"}
    </button>
  );
}
