/**
 * Description: This component displays the voting results of a game, including the impostor's identity, voting statistics, and allows the host to restart the game or leave the lobby.
 */
import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import socket from "../socket";
import "../styles/ResultPage.css";
import {checkGameStatusAndRedirect} from "../utils/checkGameStatusAndRedirect.ts";
import {handleLeaveGame} from "../utils/handleLeaveGame.ts";
import LeaveButton from "../components/LeaveButton.tsx";
import ErrorDisplay from "../components/ErrorDisplay.tsx";
import {PlayIcon} from "../components/icons/PlayIcon.tsx";

type PlayerDTO = {
    playerId: number;
    name: string;
    playerToken: string;
    gameId: string;
    isHost: boolean;
    isImpostor: boolean;
};

type VoteDTO = {
    id: number;
    gameId: string;
    voterId: number;
    votedPlayerId: number;
};

type GameDTO = {
    gameId: string;
    mainWord: string;
    status: string;
    currentPlayerId: number;
};

type ResultDTO = {
    game: GameDTO;
    votes: VoteDTO[];
};

type ProcessedVote = {
    voterId: number;
    voteCount: number;
    name: string;
};

type GameResult = {
    impostor: PlayerDTO;
    votes: ProcessedVote[];
    mostVotes: ProcessedVote;
    main_word: string;
    game: GameDTO;
};

const PARTICLE_COUNT = 20;
const CONFETTI_COUNT = 30;

const ResultsPage = () => {
    const [results, setResults] = useState<GameResult>();
    const [mostVotes, setMostVotes] = useState<ProcessedVote>();
    const [impostorPlayer, setImpostorPlayer] = useState<PlayerDTO>();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>();
    const [isRestarting, setIsRestarting] = useState(false);
    const [players, setPlayers] = useState<PlayerDTO[]>([]);
    const {gameId} = useParams();
    const navigate = useNavigate();
    const currentPlayerToken = localStorage.getItem("playerToken");

    // Initialize game status check
    useEffect(() => {
        checkGameStatusAndRedirect(gameId, navigate, setError);
        socket.emit("updateLobby", gameId);
    }, [gameId, navigate]);

    // Handle socket events for game restart
    useEffect(() => {
        const handleRestartSuccess = () => setIsRestarting(false);
        const handleGameRestarted = () => navigate(`/lobby/${gameId}`);
        const handleLobbyPlayers = (data: PlayerDTO[] | PlayerDTO) => {
            setPlayers(Array.isArray(data) ? data : []);
        };

        const handleRestartError = (data: { message: string }) => {
            console.error("Fehler beim Neustart:", data);
            setError(data.message);
            setIsRestarting(false);
        };

        socket.on("restartSuccess", handleRestartSuccess);
        socket.on("gameRestarted", handleGameRestarted);
        socket.on("lobbyPlayers", handleLobbyPlayers);
        socket.on("restartError", handleRestartError);

        return () => {
            socket.off("restartSuccess", handleRestartSuccess);
            socket.off("gameRestarted", handleGameRestarted);
            socket.off("lobbyPlayers", handleLobbyPlayers);
            socket.off("restartError", handleRestartError);
        };
    }, [gameId, navigate]);

    // Create floating particles and confetti
    useEffect(() => {
        const particlesContainer = document.querySelector(".floating-particles");
        if (!particlesContainer) return;

        particlesContainer.innerHTML = "";

        // Create regular particles
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            const particle = document.createElement("div");
            particle.className = "particle";
            particle.style.left = `${Math.random() * 100}%`; //NOSONAR
            particle.style.top = `${Math.random() * 100}%`;//NOSONAR
            particle.style.animationDelay = `${Math.random() * 12}s`;//NOSONAR
            particle.style.animationDuration = `${10 + Math.random() * 5}s`;//NOSONAR
            particlesContainer.appendChild(particle);
        }

        // Create confetti if impostor was found
        if (mostVotes && mostVotes.voterId === impostorPlayer?.playerId) {
            for (let i = 0; i < CONFETTI_COUNT; i++) {
                const confetti = document.createElement("div");
                confetti.className = "confetti-particle";
                confetti.style.left = `${Math.random() * 100}%`;//NOSONAR
                confetti.style.top = `${Math.random() * 100}%`;//NOSONAR
                confetti.style.animationDelay = `${Math.random() * 2}s`;//NOSONAR
                confetti.style.animationDuration = `${2 + Math.random() * 2}s`;//NOSONAR
                particlesContainer.appendChild(confetti);
            }
        }
    }, [mostVotes, impostorPlayer]);

    // Process raw votes into aggregated vote counts
    const processVotes = (rawVotes: VoteDTO[], players: PlayerDTO[]): ProcessedVote[] => {
        const voteCount = new Map<number, number>();
        const playerNames = new Map<number, string>();

        // Build player name map
        for (const player of players) {
            playerNames.set(player.playerId, player.name);
        }

        // Count votes for each player
        for (const vote of rawVotes) {
            const currentCount = voteCount.get(vote.votedPlayerId) || 0;
            voteCount.set(vote.votedPlayerId, currentCount + 1);
        }


        // Convert to ProcessedVote array
        return Array.from(voteCount.entries()).map(([playerId, count]) => ({
            voterId: playerId,
            voteCount: count,
            name: playerNames.get(playerId) || `Spieler ${playerId}`
        }));
    };

    // Fetch voting results from the API
    useEffect(() => {
        const fetchResults = async () => {
            try {
                // Fetch results
                const response = await fetch(`/api/result/get/${gameId}`);
                if (!response.ok) {
                    setError("Fehler beim Laden der Ergebnisse");
                    return;
                }

                // Fetch players
                const playerRes = await fetch(`/api/player/${gameId}`);
                if (!playerRes.ok) {
                    throw new Error("Fehler beim Laden der Spieler");
                }

                const playersData: PlayerDTO[] = await playerRes.json();

                // Find impostor
                const impostor = playersData.find(player => player.isImpostor);
                if (!impostor) {
                    throw new Error("Kein Impostor gefunden");
                }

                const resultData: ResultDTO = await response.json();

                // Process votes
                const processedVotes = processVotes(resultData.votes, playersData);
                const winner = getMostVotes(processedVotes);

                // Create game result
                const gameResult: GameResult = {
                    impostor: impostor,
                    votes: processedVotes,
                    mostVotes: winner,
                    main_word: resultData.game.mainWord,
                    game: resultData.game
                };

                setResults(gameResult);
                setMostVotes(winner);
                setImpostorPlayer(impostor);
                setPlayers(playersData);

            } catch {
                setError("Fehler beim Laden der Ergebnisse");
            } finally {
                setLoading(false);
            }
        };

        fetchResults();
    }, [gameId]);

    const getMostVotes = (votes: ProcessedVote[]): ProcessedVote => {

        if (!votes || votes.length === 0) return {
            voterId: 1,
            voteCount: 0,
            name: ""
        };

        return votes.reduce((mostVoted, vote) => { //NOSONAR
            return vote.voteCount > mostVoted.voteCount ? vote : mostVoted;
        },);
    };

    const restartGame = () => {
        try {
            setIsRestarting(true);
            setError(null);

            socket.emit("restartGame", {
                gameId: gameId,
                playerToken: currentPlayerToken,
            });
        } catch {
            setError(`Fehler beim Neustart`);
            setIsRestarting(false);
        }
    };

    const getWinnerClass = (isImpostor: boolean, isWinner: boolean): string => {
        if (isImpostor) return "impostor";
        return isWinner ? "winner" : "normal";
    };

    const renderLoadingState = () => (
        <div className="results-page">
            <div className="background-elements">
                <div className="bg-blob bg-blob-1"></div>
                <div className="bg-blob bg-blob-2"></div>
                <div className="bg-blob bg-blob-3"></div>
            </div>
            <div className="floating-particles"></div>
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <div className="loading-text">Lade Ergebnisse...</div>
            </div>
        </div>
    );

    if (loading) return renderLoadingState();
    if (!results) {
        setError("Keine Ergebnisse gefunden");
        return null
    }
    const {votes, main_word} = results;
    const wasImpostorFound = mostVotes && mostVotes.voterId === impostorPlayer?.playerId;
    const totalVotes = votes.reduce((sum, vote) => sum + vote.voteCount, 0);
    const currentPlayer = players.find(p => p.playerToken === currentPlayerToken);
    const isHost = currentPlayer?.isHost === true;
    const statusClass = wasImpostorFound ? "success" : "failure";

    return (
        <div className="results-page">
            <div className="background-elements">
                <div className="bg-blob bg-blob-1"></div>
                <div className="bg-blob bg-blob-2"></div>
                <div className="bg-blob bg-blob-3"></div>
            </div>
            <div className="floating-particles"></div>

            <div className="results-header">
                <h1 className="results-title">Spielergebnis</h1>
            </div>

            <div className="results-content">
                {/* Main Result */}
                <div className={`main-result-card ${statusClass}`}>
                    {wasImpostorFound ? (
                        <div>
                            <h2 className="main-result-title success">Impostor gefunden!</h2>
                            {main_word && (
                                <p className="main-result-text">
                                    Das Wort war: <strong>"{main_word}"</strong>
                                </p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h2 className="main-result-title failure">Impostor hat gewonnen!</h2>
                            <p className="main-result-text">
                                Das Wort war: <strong>"{main_word}"</strong>
                            </p>

                        </div>
                    )}
                </div>

                {/* Impostor Info */}
                <div className="impostor-card">
                    <div className="impostor-header">
                        <div className="impostor-title">Der Impostor war:</div>
                    </div>
                    <div className="impostor-name">{impostorPlayer?.name}</div>
                </div>

                {/* Voting Results */}
                <div className="voting-results-card">
                    <div className="voting-results-header">

                        <div className="voting-results-title">Abstimmungsergebnisse</div>
                    </div>
                    <div className="total-votes-display">
                        Gesamte Stimmen: {totalVotes}
                    </div>

                    {votes.length > 0 ? (
                        <div className="vote-results-list">
                            {votes.map((vote) => {
                                const percentage = totalVotes > 0 ? Math.round((vote.voteCount / totalVotes) * 100) : 0;
                                const isImpostor = vote.voterId === impostorPlayer?.playerId;
                                const isWinner = mostVotes && vote.voterId === mostVotes.voterId;

                                return (
                                    <div
                                        key={vote.voterId}
                                        className={`vote-result-item ${isImpostor ? "impostor" : ""} ${isWinner ? "winner" : ""}`}
                                    >
                                        <div className="vote-result-header">
                                            <div className="vote-result-player">{vote.name}</div>
                                            <div className="vote-result-count">
                                                {vote.voteCount} {vote.voteCount === 1 ? "Stimme" : "Stimmen"}
                                            </div>
                                        </div>

                                        <div className="vote-progress-container">
                                            <div
                                                className={`vote-progress-fill ${getWinnerClass(isImpostor, isWinner as boolean)}`}
                                                style={{width: `${percentage}%`}}
                                            >
                                                {percentage > 15 && (
                                                    <div className="vote-progress-text">
                                                        {percentage}%
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="empty-state">Keine Stimmen abgegeben</div>
                    )}
                </div>

                {/* Actions */}
                <div className="actions-container">
                    {isHost && (

                        <button
                            onClick={restartGame}
                            className="liquid-glass-button liquid-glass-button-green"
                            disabled={isRestarting}
                        >
                            <PlayIcon/>
                            Spiel Neu Starten
                        </button>
                    )}

                    <LeaveButton
                        isHost={isHost}
                        handleOnClick={() => handleLeaveGame(currentPlayerToken, setError, gameId, navigate)}
                    />
                </div>
                <ErrorDisplay error={error} setError={setError}/>
            </div>
        </div>
    );
};

export default ResultsPage;