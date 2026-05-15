import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket';
import { checkGameStatusAndRedirect } from '../utils/checkGameStatusAndRedirect.ts';
import { handleLeaveGame } from '../utils/handleLeaveGame.ts';
import LeaveButton from '../components/LeaveButton.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';
import { Profile } from '../components/icons/Profile';
import { ProfileWithCrown } from '../components/icons/ProfileWithCrown.tsx';
import { CheckIcon } from '../components/icons/CheckIcon.tsx';
import { CopyIcon } from '../components/icons/CopyIcon.tsx';
import { PlayIcon } from '../components/icons/PlayIcon.tsx';

import { Tooltip as ReactTooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

type Player = {
    id: number;
    playerToken: string;
    name: string;
    is_impostor: boolean;
    isHost: boolean;
};

const LobbyPage = () => {
    const {gameId} = useParams();
    const navigate = useNavigate();
    const [players, setPlayers] = useState<Player[]>([]);
    const [error, setError] = useState<string | null>();
    const currentPlayerToken = localStorage.getItem("playerToken");
    const [copied, setCopied] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        checkGameStatusAndRedirect(gameId, navigate, setError);
        socket.emit("updateLobby", gameId);
    }, [gameId, navigate]);

    const startGame = async () => {
        if (!ready) {
            setError("Mindestens 3 Spieler benötigt um das Spiel zu starten");
            return;
        }
        try {
            const gameRes = await fetch(`/api/game/updategameword/${gameId}`, { method: "PUT" });
            if (!gameRes.ok) { setError("Fehler beim Starten des Spiels"); return; }

            const impostorRes = await fetch(`/api/player/set-impostor/${gameId}`, { method: "PUT" });
            if (!impostorRes.ok) { setError("Fehler beim starten des Spiels"); return; }

            socket.emit("startGame", gameId);
        } catch {
            setError("Fehler beim Starten des Spiels");
        }
    };

    const handleCopy = async () => {
        if (!gameId) return;
        try {
            await navigator.clipboard.writeText(gameId);
            setCopied(true);
            setTimeout(() => setCopied(false), 1000);
        } catch (err) {
            console.error("Kopieren fehlgeschlagen", err);
        }
    };

    useEffect(() => {
        socket.emit("updateLobby", gameId);

        socket.on("lobbyPlayers", (data) => {
            setPlayers(Array.isArray(data) ? data : []);
            setReady(Array.isArray(data) && data.length >= 3 && data.length < 10);
        });

        socket.on("gameStarted", () => navigate(`/game/${gameId}`));

        socket.on("gameDeleted", () => {
            setError("Der Host hat die Lobby verlassen. Das Spiel wurde beendet.");
            navigate("/");
        });

        return () => {
            socket.off("lobbyPlayers");
            socket.off("gameStarted");
            socket.off("gameDeleted");
        };
    }, [gameId, navigate]);

    const currentPlayer = players.find((p) => p.playerToken === currentPlayerToken);
    const isHost = currentPlayer?.isHost === true;

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-8 select-none max-md:p-4">

            {/* Header */}
            <div className="text-center mb-12 z-10 relative">
                <div className="flex items-center justify-center gap-4 mb-4 max-[480px]:flex-col max-[480px]:gap-2">
                    <h1 className="text-h2 font-bold title-gradient-text">Lobby</h1>
                    <button className="lobby-game-code-btn" onClick={handleCopy} type="button">
                        <span className="lobby-id-text">{gameId}</span>
                        {copied ? (
                            <span className="lobby-copy-icon"><CheckIcon /></span>
                        ) : (
                            <span className="lobby-copy-icon"><CopyIcon /></span>
                        )}
                    </button>
                </div>

                <p className="text-body-lg text-app-sec font-light mt-4">
                    {isHost
                        ? "Du bist der Host - starte das Spiel wenn alle bereit sind"
                        : "Warte bis der Host das Spiel startet"}
                </p>

                {!isHost && (
                    <div className="flex items-center justify-center gap-2 mt-4">
                        <div className="lobby-waiting-dot" />
                        <div className="lobby-waiting-dot" />
                        <div className="lobby-waiting-dot" />
                    </div>
                )}
            </div>

            {/* Spieler */}
            <div className="z-10 relative mb-12 w-full max-w-[80rem]">
                <div className="text-center text-h4 font-semibold text-app-text mb-8 flex items-center justify-center gap-2">
                    {players.length} Spieler
                </div>
                <div className="flex flex-wrap justify-center items-center gap-6 max-w-full max-md:gap-4 max-sm:gap-3">
                    {Array.isArray(players) && players.map((player) => (
                        <div key={player.playerToken} className="lobby-player-card">
                            <div className="w-[60px] h-[60px] rounded-full flex items-center justify-center mx-auto mb-4 relative isolate shadow-[inset_0_0_15px_-5px_#000] bg-transparent p-0">
                                {player.isHost ? <ProfileWithCrown /> : <Profile />}
                            </div>
                            <div className="text-body-lg font-semibold text-app-text mb-2">{player.name}</div>
                            <div className={`text-sm font-medium ${
                                player.playerToken === currentPlayerToken
                                    ? 'text-cyan font-semibold'
                                    : player.isHost
                                    ? 'text-warning font-semibold'
                                    : 'text-app-sec'
                            }`}>
                                {player.playerToken === currentPlayerToken && "(Du) "}
                                {player.isHost && "Host"}
                                {!player.isHost && player.playerToken !== currentPlayerToken && <br />}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Steuerung */}
            <div className="z-10 w-[350px] relative flex gap-4 flex-wrap justify-center max-lg:flex-col max-lg:items-center">
                {isHost && (
                    <div
                        {...(ready ? {} : {
                            "data-tooltip-id": "start-tooltip",
                            "data-tooltip-content": "Mindestens 3 Spieler benötigt und Maximal 10 Spieler erlaubt",
                        })}
                        style={{display: "inline-block", width: "100%"}}
                    >
                        <button
                            onClick={startGame}
                            className="liquid-glass-button liquid-glass-button-green"
                            disabled={!ready}
                            type="button"
                        >
                            <PlayIcon />Spiel Starten
                        </button>
                        <ReactTooltip id="start-tooltip" place="top" className="custom-tooltip" />
                    </div>
                )}
                <LeaveButton
                    isHost={isHost}
                    handleOnClick={() => handleLeaveGame(currentPlayerToken, setError, gameId, navigate)}
                />
            </div>

            <ErrorDisplay error={error} setError={setError} />
        </div>
    );
};

export default LobbyPage;
