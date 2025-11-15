import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

// Add your old URL → new URL mappings here
const redirectMap: Record<string, string> = {
  // Example: "/old-about": "/about",
  // Example: "/blog/old-article": "/docs/new-article",
  // Add your redirects below:
};

const Redirects = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname;
    const newPath = redirectMap[currentPath];

    if (newPath) {
      // Perform 301 redirect (in SPA, we use replace to avoid history pollution)
      navigate(newPath, { replace: true });
    }
  }, [location, navigate]);

  return null;
};

export default Redirects;
