"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/StartPage.css';
import ErrorDisplay from '../components/ErrorDisplay.tsx';
import { PlusIcon } from '../components/icons/PlusIcon';
import { Profile } from '../components/icons/Profile';

const StartPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [gameId, setGameId] = useState('');
  const [error, setError] = useState<string | null>();

  // Handle game creation
  const handleCreateGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    try {
      if (name.length > 10) {
        setError('Der Name darf maximal 10 Zeichen lang sein.');
        return;
      }

      const res = await fetch(`/api/game/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!res.ok) {
        if (res.status === 500) {
          setError('Serverfehler. Bitte später erneut versuchen.');
        } else {
          setError(`Fehler beim Erstellen des Spiels`);
        }
        return;
      }

      const data = await res.json();
      const newGameId = data.gameId;

      const playerData = {
        name: name,
        gameId: newGameId,
        isHost: true,
      };

      const joinRes = await fetch(
        `/api/player/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(playerData),
        },
      );

      if (!joinRes.ok) {
        setError('Fehler beim Beitreten der Erstellten Lobby');
      }

      const joinData = await joinRes.json();

      if (joinData.playerToken) {
        localStorage.setItem('playerToken', joinData.playerToken);
      } else {
        setError('Fehler beim Beitreten der Erstellten Lobby');
      }

      navigate(`/lobby/${newGameId}`);

    } catch {
      setError('Unbekanter Fehler ist aufgetreten. Bitte später erneut versuchen.');
    }
  };

  // Handle joining an existing game
  const handleJoinGame = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      if (name.length > 10) {
        setError('Der Name darf maximal 10 Zeichen lang sein.');
        return;
      }

      const playerData = {
        name: name,
        gameId: gameId,
        isHost: 0,
      };

      const gameres = await fetch(
        `/api/game/${gameId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      if (!gameres.ok) {
        if (gameres.status === 500) {
          setError('Serverfehler. Bitte später erneut versuchen.');
        } else if (gameres.status === 404) {
          setError('Das Spiel mit dem Code ' + gameId + ' existiert nicht.');
        } else {
          setError(`Fehler beim Erstellen des Spiels`);
        }
        return;
      }

      const gameData = await gameres.json();

      if (gameData.status !== 'LOBBY') {
        setError(
          'Dieser Lobby kann nicht mehr beigetreten werden - das Spiel läuft bereits oder ist beendet.',
        );
        return;
      }
      const res = await fetch(`/api/player/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(playerData),
      });

      if (!res.ok) {
        setError('Fehler beim erstellen des Spielers');
        return;
      }

      const data = await res.json();

      if (data.playerToken) {
        localStorage.setItem('playerToken', data.playerToken);
      }

      navigate(`/lobby/${gameId}`);

    } catch {
      setError('Unbekanter Fehler ist aufgetreten. Bitte später erneut versuchen.');
    }
  };

  // Render the StartPage component
  return (
    <div className="start-page">

      {/* Main Content */}
      <div className="start-header-section">
        <h1 className="start-main-title">Impostor Game</h1>
        <p className="start-subtitle">A word. An impostor. </p>
      </div>

      <div className="start-forms-container">

        {/* Create Game Card */}
        <div className="liquid-glass">
          <div className="start-card-header">
            <h2 className="start-card-title">Spiel Erstellen</h2>
            <p className="start-card-description">
              Starte eine neue Runde als Host
            </p>
          </div>
          <div className="start-card-content">
            <form onSubmit={handleCreateGame} className="start-form">
              <div className="start-input-group">
                <input
                  type="text"
                  required
                  placeholder="Dein Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="liquid-glass-input liquid-glass-input-red"
                  maxLength={10}
                />
              </div>
              <button
                type="submit"
                className="liquid-glass-button liquid-glass-button-violet"
              >
                <PlusIcon/>
                Lobby Erstellen
              </button>
            </form>
          </div>
        </div>

        {/* Join Game Card */}
        <div className="liquid-glass">
          <div className="start-card-header">
            <h2 className="start-card-title">Spiel Beitreten</h2>
            <p className="start-card-description">
              Tritt einer bestehenden Lobby bei
            </p>
          </div>
          <div className="start-card-content">
            <form onSubmit={handleJoinGame} className="start-form">
              <div className="start-input-group">
                <input
                  type="text"
                  required
                  placeholder="Dein Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="liquid-glass-input liquid-glass-input-blue"
                  maxLength={10}
                />
                <input
                  type="text"
                  required
                  placeholder="Lobby Code"
                  value={gameId}
                  onChange={(e) => setGameId(e.target.value)}
                  className="liquid-glass-input liquid-glass-input-blue"
                  maxLength={6}
                />
              </div>
              <button
                type="submit"
                className="liquid-glass-button liquid-glass-button-blue"
              >
                <Profile className="liquid-glass-button-svg-startpage"/>
                Lobby Beitreten
              </button>
            </form>
          </div>
        </div>
      </div>

      <ErrorDisplay error={error} setError={setError}/>

    </div>
  );
};

export default StartPage;
