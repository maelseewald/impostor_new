import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import LobbyPage from './pages/LobbyPage';
import GamePage from './pages/GamePage';
import VotingPage from './pages/VotingPage';
import ResultPage from './pages/ResultPage';
import StartPage from './pages/StartPage';
import AnimatedBackground from './components/AnimatedBackground.tsx';

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root-Element mit id=\'root\' wurde nicht gefunden.');
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AnimatedBackground/>
      <Routes>
        <Route path="/" element={<StartPage/>}/>
        <Route path="/lobby/:gameId" element={<LobbyPage/>}/>
        <Route path="/game/:gameId" element={<GamePage/>}/>
        <Route path="/voting/:gameId" element={<VotingPage/>}/>
        <Route path="/results/:gameId" element={<ResultPage/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
