import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket';
import { checkGameStatusAndRedirect } from '../utils/checkGameStatusAndRedirect.ts';
import { Profile } from '../components/icons/Profile';
import { ProfileWithCrown } from '../components/icons/ProfileWithCrown.tsx';
import { ImposterIcon } from '../components/icons/ImposterIcon.tsx';
import { SendIcon } from '../components/icons/SendIcon.tsx';

type Player = {
  playerId: number;
  playerToken: string;
  name: string;
  isImpostor: boolean;
  isHost: boolean;
};

type GameWord = {
  playerName: string;
  playerId: number;
  word: string;
};

const GamePage = () => {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [word, setWord] = useState('');
  const [isImpostor, setIsImpostor] = useState(false);
  const [gameWords, setGameWords] = useState<GameWord[]>([]);
  const [currentPlayer, setCurrentPlayer] = useState<Player | undefined | null>();
  const [isMyTurn, setIsMyTurn] = useState(false);
  const [gameStatus, setGameStatus] = useState('loading');
  const [error, setError] = useState<string | null>();
  const currentPlayerToken = localStorage.getItem('playerToken');
  const [myPlayerId, setMyPlayerId] = useState<number>();

  useEffect(() => {
    checkGameStatusAndRedirect(gameId, navigate, setError);
    socket.emit('updateLobby', gameId);
  }, [gameId, navigate]);

  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => setError(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  useEffect(() => {
    const initializeGame = async () => {
      try {
        const gameRes = await fetch(`/api/game/${gameId}`);
        const gameData = await gameRes.json();
        setGameStatus(gameData.status);

        const wordRes = await fetch(`/api/playerword/${gameId}`);
        const words = await wordRes.json();
        setGameWords(words);

        const playersRes = await fetch(`/api/player/${gameId}`);
        const playersData: Player[] = await playersRes.json();
        setPlayers(playersData);

        const me = playersData.find(p => p.playerToken === currentPlayerToken);

        if (me) {
          setMyPlayerId(me.playerId);
          setIsImpostor(me.isImpostor);
          if (gameData.currentPlayerId === myPlayerId) {
            setIsMyTurn(true);
          }
        }

        const currentPlayerData = playersData.find((p) => p.playerId === gameData.currentPlayerId);
        setCurrentPlayer(currentPlayerData);

        if (gameData.mainWord && me && !me.isImpostor) {
          setWord(gameData.mainWord);
        }

        socket.emit('updateWords', gameId);
        socket.emit('updateGame', gameId);
      } catch {
        setError('Das Spiel konnte nicht geladen werden. Bitte versuche es erneut.');
      }
    };

    initializeGame();
    socket.emit('joinGame', gameId);

    socket.on('gameWords', (words) => setGameWords(words));

    socket.on('gameStarted', (data) => {
      if (data.currentPlayer) {
        setCurrentPlayer(data.currentPlayer);
        setIsMyTurn(data.currentPlayer.id === myPlayerId);
      }
      setGameStatus('PLAYING');
    });

    socket.on('gameUpdate', (data) => {
      const current = data.players.find((p: Player) => p.playerId === data.currentPlayerId);
      setCurrentPlayer(current);
      const me = data.players.find((p: Player) => p.playerToken === currentPlayerToken);
      if (me) {
        setIsMyTurn(data.currentPlayerId === me.playerId);
      }
    });

    socket.on('gamePhaseChanged', (data) => {
      setGameStatus(data.phase);
      setCurrentPlayer(null);
      setIsMyTurn(false);
      if (data.phase === 'VOTING') {
        navigate(`/voting/${gameId}`);
      }
    });

    socket.on('wordSubmitError', (data) => setError(data.message));

    const handleBeforeUnload = () => socket.emit('leaveLobby', gameId);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socket.off('gameWords');
      socket.off('gameStarted');
      socket.off('gameUpdate');
      socket.off('nextPlayerTurn');
      socket.off('gamePhaseChanged');
      socket.off('wordSubmitSuccess');
      socket.off('wordSubmitError');
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [gameId, navigate, currentPlayerToken, myPlayerId]);

  const sendWordViaSocket = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const wordInputElement = form.elements.namedItem('wordinput') as HTMLInputElement;
    const wordInput = wordInputElement.value.trim();

    if (!wordInput) {
      setError('Bitte gib ein Wort ein!');
      return;
    }
    if (!isMyTurn) {
      setError('Du bist nicht am Zug!');
      return;
    }

    socket.emit('submitWord', { gameId, word: wordInput, playerToken: currentPlayerToken });
    form.reset();
  };

  const renderRoleCard = () => (
    <div className={`role-card p-12 ${isImpostor ? 'impostor' : 'regular'}`}>
      {isImpostor && (
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(0,0,0,0.2)] bg-gradient-to-r from-error to-error-dark">
          <ImposterIcon/>
        </div>
      )}
      {isImpostor ? (
        <h2 className="text-h4 font-bold text-error mb-2">Du bist der Impostor!</h2>
      ) : (
        <div>
          <h3 className="text-h4 font-bold text-success mb-2">Dein Wort ist:</h3>
          <div className="word-display text-h3 font-bold text-app-text p-4 mt-4">{word}</div>
        </div>
      )}
    </div>
  );

  const renderWordInputForm = () => (
    <div className="word-input-panel relative p-8">
      <form onSubmit={sendWordViaSocket}>
        <div className="flex items-center gap-4 flex-col justify-between">
          <input
            name="wordinput"
            type="text"
            required
            placeholder={isImpostor ? 'Rate ein passendes Wort' : 'Gib ein verwandtes Wort ein'}
            maxLength={50}
            className="liquid-glass-input liquid-glass-input-green w-full"
          />
          <button type="submit" className="liquid-glass-button">
            <SendIcon/>
            Wort senden
          </button>
        </div>
      </form>
    </div>
  );

  const renderGameContent = () => {
    if (gameStatus === 'PLAYING') {
      return (
        <div className="flex flex-col gap-6">
          {renderRoleCard()}
          {isMyTurn && renderWordInputForm()}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col p-4 max-md:p-2">
      <div className="flex w-full justify-center flex-col">
        {renderGameContent()}
      </div>
      <div className="glass-panel p-8 mt-5">
        <div className="z-10 relative w-full max-w-[80rem] mx-auto">
          <div className="text-center text-h4 font-semibold text-app-text mb-8 flex items-center justify-center gap-2">
            {players.length} Spieler
          </div>
          <div className="flex flex-wrap justify-center items-center gap-6 max-w-full">
            {Array.isArray(players) && players.map((player) => {
              const playerWord = gameWords?.find((gw) => gw.playerId === player.playerId);
              return (
                <div
                  key={player.playerToken}
                  className={`lobby-player-card game-page-player-card ${
                    player.playerId === myPlayerId ? 'border-[2px] border-accent2/30' : ''
                  }`}
                >
                  <div
                    className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-4 relative isolate shadow-[inset_0_0_15px_-5px_#000] bg-transparent p-0">
                    {player.isHost ? <ProfileWithCrown/> : <Profile/>}
                  </div>
                  <div className="text-app-text font-medium flex-1">{player.name}</div>
                  <div className="flex gap-1">
                    {currentPlayer?.playerId === player.playerId && (
                      <span
                        className="text-xs px-1.5 py-0.5 rounded font-medium bg-success/30 text-success animate-pulse-glow">DRAN</span>
                    )}
                  </div>
                  {playerWord && (
                    <div className="font-semibold text-purple break-words text-center max-w-full">
                      Wort: {playerWord.word}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GamePage;
