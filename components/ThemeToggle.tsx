'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();

  // Don't render on server to avoid hydration mismatch
  if (typeof window === 'undefined') {
    return (
      <Button variant="ghost" size="icon" className="w-9 h-9">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => {
        setTheme(currentTheme === 'dark' ? 'light' : 'dark');
      }}
      className="w-9 h-9"
    >
      {currentTheme === 'dark' ? (
        <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
