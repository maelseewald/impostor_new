'use client';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
    <div className="min-h-screen w-full relative overflow-hidden flex flex-col items-center justify-center p-2">

      <div className="text-center mb-12 z-10 relative">
        <h1 className="text-hero font-bold mb-4 leading-none title-gradient-text">Impostor Game</h1>
        <p className="text-subtitle text-app-text font-light tracking-wider">A word. An impostor.</p>
      </div>

      <div className="flex gap-8 w-full max-w-5xl z-10 relative max-lg:flex-col max-lg:max-w-xl max-md:px-4">

        {/* Create Game Card */}
        <div className="liquid-glass">
          <div className="text-center px-10 pt-6 pb-2">
            <h2 className="text-h4 font-bold text-app-text mb-1">Spiel Erstellen</h2>
            <p className="text-app-sec text-sm">Starte eine neue Runde als Host</p>
          </div>
          <div className="px-10 pb-6">
            <form onSubmit={handleCreateGame} className="flex flex-col gap-4">
              <input
                type="text"
                required
                placeholder="Dein Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="liquid-glass-input liquid-glass-input-red"
                maxLength={10}
              />
              <button type="submit" className="liquid-glass-button liquid-glass-button-violet">
                <PlusIcon/>
                Lobby Erstellen
              </button>
            </form>
          </div>
        </div>

        {/* Join Game Card */}
        <div className="liquid-glass">
          <div className="text-center px-10 pt-6 pb-2">
            <h2 className="text-h4 font-bold text-app-text mb-1">Spiel Beitreten</h2>
            <p className="text-app-sec text-sm">Tritt einer bestehenden Lobby bei</p>
          </div>
          <div className="px-10 pb-6">
            <form onSubmit={handleJoinGame} className="flex flex-col gap-4">
              <div className="flex flex-col gap-4">
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
              <button type="submit" className="liquid-glass-button liquid-glass-button-blue">
                <Profile className="mb-1"/>
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
