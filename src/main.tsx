import React from 'react'; // <-- StrictMode සඳහා මෙය import කරන්න
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { SpeedInsights } from "@vercel/speed-insights/react"; // <-- Speed Insights import එක

// Initialize theme on page load
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = savedTheme || systemTheme;
  
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
};

initTheme();

// App එක සහ SpeedInsights component එක StrictMode ඇතුළත render කරන්න
createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
    <SpeedInsights />
  </React.StrictMode>
);