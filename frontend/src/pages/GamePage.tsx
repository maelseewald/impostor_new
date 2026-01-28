/**
 * Author: Maël Seewald
 * Date: 2025-06-25
 * Version: 1.0
 * Description: This ist the GamePage where Players can send their word.
 */
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import socket from "../socket";
import "../styles/GamePage.css";
import {checkGameStatusAndRedirect} from "../utils/checkGameStatusAndRedirect.ts";
import {Profile} from "../components/icons/Profile";
import {ProfileWithCrown} from "../components/icons/ProfileWithCrown.tsx";
import {ImposterIcon} from "../components/icons/ImposterIcon.tsx";
import {SendIcon} from "../components/icons/SendIcon.tsx";

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
    const {gameId} = useParams();
    const navigate = useNavigate();
    const [players, setPlayers] = useState<Player[]>([]);
    const [word, setWord] = useState("");
    const [isImpostor, setIsImpostor] = useState(false);
    const [gameWords, setGameWords] = useState<GameWord[]>([]);
    const [currentPlayer, setCurrentPlayer] = useState<Player | undefined | null>();
    const [isMyTurn, setIsMyTurn] = useState(false);
    const [gameStatus, setGameStatus] = useState("loading");
    const [error, setError] = useState<string | null>();
    const currentPlayerToken = localStorage.getItem("playerToken");
    const [myPlayerId, setMyPlayerId] = useState<number>();

    // Check which game status the game is in and prevent toggling back and forth in the history.
    useEffect(() => {
        checkGameStatusAndRedirect(gameId, navigate, setError);
        socket.emit("updateLobby", gameId);
    }, [gameId, navigate]);

    // Automatically hide the error message after 2 seconds
    useEffect(() => {
        if (error) {
            const timer = setTimeout(() => {
                setError(null);
            }, 2000);
            return () => clearTimeout(timer);
        }
    }, [error]);

    // Create floating particles
    useEffect(() => {
        const particlesContainer = document.querySelector(".floating-particles");
        if (particlesContainer) {
            particlesContainer.innerHTML = "";

            for (let i = 0; i < 12; i++) {
                const particle = document.createElement("div");
                particle.className = "particle";
                particle.style.left = `${Math.random() * 100}%`;  // NOSONAR
                particle.style.top = `${Math.random() * 100}%`;  // NOSONAR
                particle.style.animationDelay = `${Math.random() * 8}s`;  // NOSONAR
                particle.style.animationDuration = `${6 + Math.random() * 4}s`;  // NOSONAR
                particlesContainer.appendChild(particle);
            }
        }
    }, []);

    // Initializes the game: Loads game and player data, sets player status, and loads the secret word if applicable
    useEffect(() => {
        const initializeGame = async () => {
            try {
                const gameRes = await fetch(
                    `/api/game/${gameId}`
                );
                const gameData = await gameRes.json();
                setGameStatus(gameData.status);

                const wordRes = await fetch(
                    `/api/playerword/${gameId}`
                );
                const words = await wordRes.json();
                setGameWords(words);

                const playersRes = await fetch(
                    `/api/player/${gameId}`
                );

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

                const currentPlayerData = playersData.find(
                    (p) => p.playerId === gameData.currentPlayerId
                );
                setCurrentPlayer(currentPlayerData);


                if (gameData.mainWord && me && !me.isImpostor) {

                    setWord(gameData.mainWord);
                }

                socket.emit("updateWords", gameId);
                socket.emit("updateGame", gameId);
            } catch {
                setError(
                    "Das Spiel konnte nicht geladen werden. Bitte versuche es erneut."
                );
            }
        };

        initializeGame();

        socket.emit("joinGame", gameId);

        socket.on("gameWords", (words) => {
            setGameWords(words);
        });

        socket.on("gameStarted", (data) => {
            if (data.currentPlayer) {
                setCurrentPlayer(data.currentPlayer);
                setIsMyTurn(data.currentPlayer.id === myPlayerId);
            }
            setGameStatus("PLAYING");
        });

        socket.on("gameUpdate", (data) => {
            const current = data.players.find(
                (p: Player) => p.playerId === data.currentPlayerId
            );
            setCurrentPlayer(current);

            const me = data.players.find(
                (p: Player) => p.playerToken === currentPlayerToken
            );

            if (me) {
                setIsMyTurn(data.currentPlayerId === me.playerId);
            }
        });


        socket.on("gamePhaseChanged", (data) => {
            setGameStatus(data.phase);

            setCurrentPlayer(null);
            setIsMyTurn(false);

            if (data.phase === "VOTING") {
                navigate(`/voting/${gameId}`);
            }
        });

        socket.on("wordSubmitError", (data) => {
            setError(data.message);
        });
        const handleBeforeUnload = () => {
            socket.emit("leaveLobby", gameId);
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            socket.off("gameWords");
            socket.off("gameStarted");
            socket.off("gameUpdate");
            socket.off("nextPlayerTurn");
            socket.off("gamePhaseChanged");
            socket.off("wordSubmitSuccess");
            socket.off("wordSubmitError");
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [gameId, navigate, currentPlayerToken, myPlayerId]);

    const sendWordViaSocket = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const form = e.target as HTMLFormElement;

        const wordInputElement = form.elements.namedItem("wordinput") as HTMLInputElement;

        const wordInput = wordInputElement.value.trim();

        if (!wordInput) {
            setError("Bitte gib ein Wort ein!");
            return;
        }

        if (!isMyTurn) {
            setError("Du bist nicht am Zug!");
            return;
        }
        socket.emit("submitWord", {
            gameId: gameId,
            word: wordInput,
            playerToken: currentPlayerToken,
        });
        form.reset();
    };


    // Load the game data
    const renderGameContent = () => {
        if (gameStatus === "PLAYING") {
            return (
                <div className="game-panel">
                    {renderRoleCard()}
                    {isMyTurn && renderWordInputForm()}
                </div>
            );
        }

        return null;
    };

    const renderRoleCard = () => (
        <div className={`role-card ${isImpostor ? "impostor" : "regular"}`}>
            <div className={` ${isImpostor && "role-icon impostor"}`}>
                {isImpostor && (
                    <ImposterIcon/>
                )}
            </div>
            {isImpostor ? (
                <h2 className="role-title impostor">Du bist der Impostor!</h2>
            ) : (
                <div>
                    <h3 className="role-title regular">Dein Wort ist:</h3>
                    <div className="word-display">{word}</div>
                </div>
            )}
        </div>
    );

    const renderWordInputForm = () => (
        <div className="word-input-form">
            <form onSubmit={sendWordViaSocket}>
                <div className="input-group">
                    <input
                        name="wordinput"
                        type="text"
                        required
                        placeholder={
                            isImpostor
                                ? "Rate ein passendes Wort"
                                : "Gib ein verwandtes Wort ein"
                        }
                        maxLength={50}
                        className="liquid-glass-input liquid-glass-input-gamepage liquid-glass-input-green"
                    />
                    <button type="submit" className="liquid-glass-button-gamepage">
                        <SendIcon/>
                        Wort senden
                    </button>
                </div>
            </form>
        </div>
    );


    // Show the GamePage
    return (
        <div className="game-page">
            {/* Animated Background Elements */}
            <div className="background-elements">
                <div className="bg-blob bg-blob-1"></div>
                <div className="bg-blob bg-blob-2"></div>
                <div className="bg-blob bg-blob-3"></div>
            </div>
            {/* Floating Particles */}
            <div className="floating-particles"></div>
            {/* Game Panel */}
            <div className="game-content">
                {/* Game Content */}
                {renderGameContent()}
            </div>
            <div className="players-panel">
                <div className="lobby-players-section changeForGamePage">
                    <div className="lobby-players-title">{players.length} Spieler</div>
                    <div className="lobby-players-grid">
                        {Array.isArray(players) &&
                            players.map((player) => {
                                const playerWord = gameWords?.find((gameWord) => gameWord.playerId === player.playerId);

                                return (
                                    <div
                                        key={player.playerToken}
                                        className={`lobby-player-card game-page-player-card ${
                                            player.playerId === myPlayerId ? "badge-you" : ""
                                        }`}
                                    >
                                        <div className="lobby-player-avatar">
                                            {player.isHost ? <ProfileWithCrown/> : <Profile/>}
                                        </div>

                                        <div className="lobby-player-name">{player.name}</div>

                                        <div className="player-badges">
                                            {currentPlayer?.playerId === player.playerId && (
                                                <span className="badge badge-turn">DRAN</span>
                                            )}
                                        </div>

                                        {playerWord && (
                                            <div className="word-player">
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
