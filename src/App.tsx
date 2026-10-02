import { NavLink, Route, Routes } from "react-router-dom";
import "./App.css";
import { Home } from "./pages/Home";
import { VersionLevels } from "./pages/VersionLevels";
import { StudyLevel0 } from "./pages/StudyLevel0";
import { Level1 } from "./pages/Level1";
import { Level2 } from "./pages/Level2";
import { Level3 } from "./pages/Level3";
import { EnglishPractice } from "./pages/EnglishPractice";
import { EnglishVocab } from "./pages/EnglishVocab";
import { EnglishReading } from "./pages/EnglishReading";
import { EnglishWriting } from "./pages/EnglishWriting";
import { Profile } from "./pages/Profile";
import { useTheme } from "./hooks/useTheme";
import { useCivicsProfile } from "./hooks/useCivicsProfile";

const THEME_ICON = { system: "🖥️", light: "☀️", dark: "🌙" } as const;
const THEME_LABEL = { system: "System", light: "Light", dark: "Dark" } as const;

function App() {
  const { theme, cycleTheme } = useTheme();
  const { profile } = useCivicsProfile();

  return (
    <div className="app">
      <header className="app__header">
        <NavLink to="/" className="app__brand">
          🇺🇸 Civics Study
        </NavLink>
        <nav className="app__nav">
          <NavLink to="/" end>
            Civics
          </NavLink>
          <NavLink to="/english">English</NavLink>
          <NavLink to="/profile" className="app__nav-state">
            📍 {profile.state ?? "Set my state"}
          </NavLink>
          <button
            type="button"
            className="app__theme-toggle"
            onClick={cycleTheme}
            title={`Theme: ${THEME_LABEL[theme]} (click to change)`}
            aria-label={`Change theme, currently ${THEME_LABEL[theme]}`}
          >
            {THEME_ICON[theme]}
          </button>
        </nav>
      </header>
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/study/:version" element={<VersionLevels />} />
          <Route path="/study/:version/level0" element={<StudyLevel0 />} />
          <Route path="/study/:version/level1" element={<Level1 />} />
          <Route path="/study/:version/level2" element={<Level2 />} />
          <Route path="/study/:version/level3" element={<Level3 />} />
          <Route path="/english" element={<EnglishPractice />} />
          <Route path="/english/vocab/:list" element={<EnglishVocab />} />
          <Route path="/english/reading" element={<EnglishReading />} />
          <Route path="/english/writing" element={<EnglishWriting />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
