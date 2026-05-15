import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket';
import { checkGameStatusAndRedirect } from '../utils/checkGameStatusAndRedirect.ts';
import { handleLeaveGame } from '../utils/handleLeaveGame.ts';
import LeaveButton from '../components/LeaveButton.tsx';
import ErrorDisplay from '../components/ErrorDisplay.tsx';
import { PlayIcon } from '../components/icons/PlayIcon.tsx';

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

    useEffect(() => {
        checkGameStatusAndRedirect(gameId, navigate, setError);
        socket.emit("updateLobby", gameId);
    }, [gameId, navigate]);

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

    useEffect(() => {
        const particlesContainer = document.querySelector(".floating-particles");
        if (!particlesContainer) return;
        particlesContainer.innerHTML = "";

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

    const processVotes = (rawVotes: VoteDTO[], players: PlayerDTO[]): ProcessedVote[] => {
        const voteCount = new Map<number, number>();
        const playerNames = new Map<number, string>();

        for (const player of players) playerNames.set(player.playerId, player.name);
        for (const vote of rawVotes) {
            const currentCount = voteCount.get(vote.votedPlayerId) || 0;
            voteCount.set(vote.votedPlayerId, currentCount + 1);
        }

        return Array.from(voteCount.entries()).map(([playerId, count]) => ({
            voterId: playerId,
            voteCount: count,
            name: playerNames.get(playerId) || `Spieler ${playerId}`
        }));
    };

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await fetch(`/api/result/get/${gameId}`);
                if (!response.ok) { setError("Fehler beim Laden der Ergebnisse"); return; }

                const playerRes = await fetch(`/api/player/${gameId}`);
                if (!playerRes.ok) throw new Error("Fehler beim Laden der Spieler");

                const playersData: PlayerDTO[] = await playerRes.json();
                const impostor = playersData.find(player => player.isImpostor);
                if (!impostor) throw new Error("Kein Impostor gefunden");

                const resultData: ResultDTO = await response.json();
                const processedVotes = processVotes(resultData.votes, playersData);
                const winner = getMostVotes(processedVotes);

                const gameResult: GameResult = {
                    impostor,
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
        if (!votes || votes.length === 0) return { voterId: 1, voteCount: 0, name: "" };
        return votes.reduce((mostVoted, vote) => { //NOSONAR
            return vote.voteCount > mostVoted.voteCount ? vote : mostVoted;
        },);
    };

    const restartGame = () => {
        try {
            setIsRestarting(true);
            setError(null);
            socket.emit("restartGame", { gameId, playerToken: currentPlayerToken });
        } catch {
            setError(`Fehler beim Neustart`);
            setIsRestarting(false);
        }
    };

    const getWinnerClass = (isImpostor: boolean, isWinner: boolean): string => {
        if (isImpostor) return "impostor";
        return isWinner ? "winner" : "normal";
    };

    if (loading) {
        return (
            <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-8">
                <div className="floating-particles absolute inset-0 overflow-hidden pointer-events-none z-[1]" />
                <div className="flex flex-col items-center justify-center p-16 text-center">
                    <div className="w-16 h-16 rounded-full border-[6px] border-white/20 border-t-purple animate-spin-cc mb-6" />
                    <div className="text-app-text text-h4 font-medium">Lade Ergebnisse...</div>
                </div>
            </div>
        );
    }

    if (!results) {
        setError("Keine Ergebnisse gefunden");
        return null;
    }

    const {votes, main_word} = results;
    const wasImpostorFound = mostVotes && mostVotes.voterId === impostorPlayer?.playerId;
    const totalVotes = votes.reduce((sum, vote) => sum + vote.voteCount, 0);
    const currentPlayer = players.find(p => p.playerToken === currentPlayerToken);
    const isHost = currentPlayer?.isHost === true;
    const statusClass = wasImpostorFound ? "success" : "failure";

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-8 max-md:p-4">
            <div className="floating-particles absolute inset-0 overflow-hidden pointer-events-none z-[1]" />

            {/* Header */}
            <div className="text-center mb-12 z-10 relative">
                <h1 className="text-h1 font-bold title-gradient-text mb-2">Spielergebnis</h1>
            </div>

            {/* Inhalt */}
            <div className="w-full max-w-4xl z-10 relative flex flex-col gap-8">

                {/* Hauptergebnis */}
                <div className={`main-result-card p-12 text-center max-md:p-6 ${statusClass}`}>
                    {wasImpostorFound ? (
                        <div>
                            <h2 className="text-h2 font-bold text-success mb-4 max-md:text-h3">
                                Impostor gefunden!
                            </h2>
                            {main_word && (
                                <p className="text-subtitle text-white/90 font-medium leading-relaxed">
                                    Das Wort war: <strong>"{main_word}"</strong>
                                </p>
                            )}
                        </div>
                    ) : (
                        <div>
                            <h2 className="text-h2 font-bold text-error mb-4 max-md:text-h3">
                                Impostor hat gewonnen!
                            </h2>
                            <p className="text-subtitle text-white/90 font-medium leading-relaxed">
                                Das Wort war: <strong>"{main_word}"</strong>
                            </p>
                        </div>
                    )}
                </div>

                {/* Impostor Info */}
                <div className="glass-card p-8 text-center">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="text-h4 font-semibold text-app-text">Der Impostor war:</div>
                    </div>
                    <div className="word-display text-h3 font-bold text-app-text mb-4 p-4">
                        {impostorPlayer?.name}
                    </div>
                </div>

                {/* Abstimmungsergebnisse */}
                <div className="glass-card p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="text-h4 font-semibold text-app-text">Abstimmungsergebnisse</div>
                    </div>
                    <div className="text-app-sec text-base mb-6">
                        Gesamte Stimmen: {totalVotes}
                    </div>

                    {votes.length > 0 ? (
                        <div className="flex flex-col gap-4">
                            {votes.map((vote) => {
                                const percentage = totalVotes > 0
                                    ? Math.round((vote.voteCount / totalVotes) * 100)
                                    : 0;
                                const isImpostor = vote.voterId === impostorPlayer?.playerId;
                                const isWinner = mostVotes && vote.voterId === mostVotes.voterId;

                                return (
                                    <div
                                        key={vote.voterId}
                                        className={`vote-result-item p-12 ${isImpostor ? "impostor" : ""} ${isWinner ? "winner" : ""}`}
                                    >
                                        <div className="flex justify-between items-center mb-4">
                                            <div className="font-semibold text-app-text text-body-lg flex items-center gap-2">
                                                {vote.name}
                                            </div>
                                            <div className="text-app-sec text-base font-medium">
                                                {vote.voteCount} {vote.voteCount === 1 ? "Stimme" : "Stimmen"}
                                            </div>
                                        </div>

                                        <div className="relative w-full h-3 rounded overflow-hidden isolate shadow-[inset_0_0_4px_rgba(0,0,0,0.4)]">
                                            <div
                                                className={`vote-progress-fill ${getWinnerClass(isImpostor, isWinner as boolean)}`}
                                                style={{width: `${percentage}%`}}
                                            >
                                                {percentage > 15 && (
                                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-app-text font-semibold text-[0.65rem]">{percentage}%</div>
                                                )}
                                            </div>
                                        </div>

                                        {isImpostor && (
                                            <div className="mt-2 text-sm text-error font-medium flex items-center gap-1">
                                                ⚠ Impostor
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-app-sec">Keine Stimmen abgegeben</div>
                    )}
                </div>

                {/* Aktionen */}
                <div className="flex gap-4 justify-center flex-wrap">
                    {isHost && (
                        <button
                            onClick={restartGame}
                            className="liquid-glass-button liquid-glass-button-green"
                            disabled={isRestarting}
                        >
                            <PlayIcon />
                            Spiel Neu Starten
                        </button>
                    )}
                    <LeaveButton
                        isHost={isHost}
                        handleOnClick={() => handleLeaveGame(currentPlayerToken, setError, gameId, navigate)}
                    />
                </div>

                <ErrorDisplay error={error} setError={setError} />
            </div>
        </div>
    );
};

export default ResultsPage;
