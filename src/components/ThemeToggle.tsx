import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleTheme}
      className="glass-panel border-white/20 hover:border-white/40 smooth-transition"
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
    >
      <div className="flex items-center gap-2">
        {theme === 'light' ? (
          <Moon className="w-4 h-4" />
        ) : (
          <Sun className="w-4 h-4" />
        )}
        <span className="text-xs font-medium">
          {theme === 'light' ? 'Dark' : 'Light'}
        </span>
      </div>
    </Button>
  );
};

export default ThemeToggle;