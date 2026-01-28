import React from 'react';
import { useTheme } from '../theme/ThemeProvider';
import { type ThemeName, themes } from '../theme/themes';

const ThemeDropdown: React.FC = () => {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={e => setTheme(e.target.value as ThemeName)}
      style={{ zIndex: 100, position: 'relative' }}
      aria-label="Theme auswählen"
    >
      {Object.keys(themes).map((key) => (
        <option key={key} value={key}>
          {themes[key as ThemeName].name}
        </option>
      ))}
    </select>
  );
};

export default ThemeDropdown;
