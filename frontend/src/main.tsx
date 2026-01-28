import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import VotingPage from './pages/VotingPage';
import ResultPage from './pages/ResultPage';
import StartPage from './pages/StartPage';

import AnimatedBackground from './components/AnimatedBackground.tsx';
import { ThemeProvider } from './theme/ThemeProvider';
import ThemeDropdown from './components/ThemeDropdown';

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root-Element mit id=\'root\' wurde nicht gefunden.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider>
      <BrowserRouter>
        <AnimatedBackground/>
        <div style={{ position: 'fixed', top: 16, right: 16, zIndex: 100 }}>
          <ThemeDropdown/>
        </div>
        <Routes>
          <Route path="/" element={<StartPage/>}/>
          <Route path="/lobby/:gameId" element={<LobbyPage/>}/>
          <Route path="/game/:gameId" element={<GamePage/>}/>
          <Route path="/voting/:gameId" element={<VotingPage/>}/>
          <Route path="/results/:gameId" element={<ResultPage/>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);
