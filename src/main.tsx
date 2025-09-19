import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme on page load
const initTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  const theme = savedTheme || systemTheme;
  
  document.documentElement.classList.remove('light', 'dark');
  document.documentElement.classList.add(theme);
};

initTheme();

createRoot(document.getElementById("root")!).render(<App />);
