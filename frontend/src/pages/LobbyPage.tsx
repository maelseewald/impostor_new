/**
 * Author: Maël Seewald
 * Date: 2025-06-25
 * Version: 1.0
 * Description: This component represents the lobby page of the game, where players can see
 * the game code, player list, and controls to start or leave the game.
 */
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import socket from "../socket";
import "../styles/LobbyPage.css";
import {checkGameStatusAndRedirect} from "../utils/checkGameStatusAndRedirect.ts";
import {handleLeaveGame} from "../utils/handleLeaveGame.ts";
import LeaveButton from "../components/LeaveButton.tsx";
import ErrorDisplay from "../components/ErrorDisplay.tsx";
import {Profile} from "../components/icons/Profile";
import {ProfileWithCrown} from "../components/icons/ProfileWithCrown.tsx";
import {CheckIcon} from "../components/icons/CheckIcon.tsx";
import {CopyIcon} from "../components/icons/CopyIcon.tsx";
import {PlayIcon} from "../components/icons/PlayIcon.tsx";

import {Tooltip as ReactTooltip} from "react-tooltip";
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

    // Check game status and redirect if necessary
    useEffect(() => {
        checkGameStatusAndRedirect(gameId, navigate, setError);
        socket.emit("updateLobby", gameId);
    }, [gameId, navigate]);

    // Create floating particles
    useEffect(() => {
        const particlesContainer = document.querySelector(
            ".lobby-floating-particles"
        );
        if (particlesContainer) {
            particlesContainer.innerHTML = "";
            for (let i = 0; i < 15; i++) {
                const particle = document.createElement("div");
                particle.className = "lobby-particle";
                particle.style.left = `${Math.random() * 100}%`; // NOSONAR
                particle.style.top = `${Math.random() * 100}%`; // NOSONAR
                particle.style.animationDelay = `${Math.random() * 6}s`; // NOSONAR
                particle.style.animationDuration = `${4 + Math.random() * 4}s`; // NOSONAR
                particlesContainer.appendChild(particle);
            }
        }
    }, []);

    // To start the game and get an impostor, a game word and show all players the GamePage.
    const startGame = async () => {
        if (!ready) {
            setError("Mindestens 3 Spieler benötigt um das Spiel zu starten");
            return
        }
        try {
            const gameRes = await fetch(`/api/game/updategameword/${gameId}`, {
                method: "PUT",
            });
            if (!gameRes.ok) {
                setError("Fehler beim Starten des Spiels");
                return;
            }

            const impostorRes = await fetch(`/api/player/set-impostor/${gameId}`, {
                method: "PUT",
            });
            if (!impostorRes.ok) {
                setError("Fehler beim starten des Spiels");
                return;
            }

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

    // Manages lobby events: updates players, handles game start or termination, and cleans up on exit
    useEffect(() => {
        socket.emit("updateLobby", gameId);

        socket.on("lobbyPlayers", (data) => {
            setPlayers(Array.isArray(data) ? data : []);
            setReady(Array.isArray(data) && data.length >= 3 && data.length < 10);
        });

        socket.on("gameStarted", () => {
            navigate(`/game/${gameId}`);
        });

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

    // Find the player you are and check if they are the host
    const currentPlayer = players.find(
        (p) => p.playerToken === currentPlayerToken
    );
    const isHost = currentPlayer?.isHost === true;

    // Show the LobbyPage with player list, and controls
    return (
        <div className="lobby-page">
            {/* Animated Background Elements */}
            <div className="lobby-background-elements">
                <div className="lobby-bg-blob lobby-bg-blob-1"></div>
                <div className="lobby-bg-blob lobby-bg-blob-2"></div>
                <div className="lobby-bg-blob lobby-bg-blob-3"></div>
            </div>

            {/* Floating Particles */}
            <div className="lobby-floating-particles"></div>

            {/* Header Section */}
            <div className="lobby-header">
                <div className="lobby-game-code-container">
                    <h1 className="lobby-game-code-title">Lobby</h1>
                    <button
                        className="lobby-game-code"
                        onClick={handleCopy}
                        type="button"
                    >
                        <span className="lobby-Id">{gameId}</span>
                        {copied ? (
                            <span className="lobby-copy-message"><CheckIcon/></span>
                        ) : (
                            <span className="lobby-copy-message"><CopyIcon/></span>
                        )}
                    </button>
                </div>


                <p className="lobby-status-text">
                    {isHost
                        ? "Du bist der Host - starte das Spiel wenn alle bereit sind"
                        : "Warte bis der Host das Spiel startet"}
                </p>

                {!isHost && (
                    <div className="lobby-waiting-indicator">
                        <div className="lobby-waiting-dot"></div>
                        <div className="lobby-waiting-dot"></div>
                        <div className="lobby-waiting-dot"></div>
                    </div>
                )}
            </div>

            {/* Players Section */}
            <div className="lobby-players-section">
                <div className="lobby-players-title">{players.length} Spieler</div>
                <div className="lobby-players-grid">
                    {Array.isArray(players) &&
                        players.map((player) => (
                            <div
                                key={player.playerToken}
                                className="lobby-player-card"
                            >
                                <div
                                    className="lobby-player-avatar"
                                >
                                    {player.isHost ? <ProfileWithCrown/> : <Profile/>}
                                </div>

                                <div className="lobby-player-name">{player.name}</div>

                                <div className="lobby-player-status">
                                    {player.playerToken === currentPlayerToken && "(Du) "}
                                    {player.isHost && "Host"}
                                    {!player.isHost &&
                                        player.playerToken !== currentPlayerToken && <br/>}
                                </div>
                            </div>
                        ))}
                </div>
            </div>

            {/* Controls Section */}
            <div className="lobby-controls-section">
                {isHost && (
                    <div
                        {...(ready
                            ? {}
                            : {
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
                        ><PlayIcon/>Spiel Starten
                        </button>
                        <ReactTooltip
                            id="start-tooltip"
                            place="top"
                            className="custom-tooltip"
                        />
                    </div>
                )}

                <LeaveButton
                    isHost={isHost}
                    handleOnClick={() =>
                        handleLeaveGame(currentPlayerToken, setError, gameId, navigate)
                    }
                />
            </div>
            <ErrorDisplay error={error} setError={setError}/>
        </div>
    );
};

export default LobbyPage;
