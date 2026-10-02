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

function App() {
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
        </Routes>
      </main>
    </div>
  );
}

export default App;
