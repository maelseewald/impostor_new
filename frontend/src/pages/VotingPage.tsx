import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket';
import { checkGameStatusAndRedirect } from '../utils/checkGameStatusAndRedirect.ts';
import ErrorDisplay from '../components/ErrorDisplay.tsx';

type WordEntry = {
    playerName: string;
    word: string;
    playerToken: string;
};

type Player = {
    playerId: number;
    playerToken: string;
    name: string;
    is_impostor: boolean;
    isHost: boolean;
}

type Vote = {
    id: number;
    gameId: number;
    voterId: string;
    votedPlayerId: string;
}

const VotingPage = () => {
    const [selectedPlayer, setSelectedPlayer] = useState("");
    const [gameWords, setGameWords] = useState<WordEntry[]>([]);
    const [error, setError] = useState<string | null>();
    const [voteSubmitted, setVoteSubmitted] = useState(false);
    const currentPlayerToken = localStorage.getItem("playerToken");
    const {gameId} = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        checkGameStatusAndRedirect(gameId, navigate, setError);
        socket.emit("updateLobby", gameId);
    }, [gameId, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            const playerToken = localStorage.getItem("playerToken");

            const playerResponse = await fetch(`/api/player/${gameId}`);
            if (!playerResponse.ok) { setError("Fehler beim Abrufen der Spieler."); return; }
            const playersData = await playerResponse.json();

            const player = playersData.find((p: Player) => p.playerToken === playerToken);
            if (!player) { setError("Spieler mit Token nicht gefunden."); return; }
            const playerId = player.playerId;

            const voteResponse = await fetch(`/api/vote/get/${gameId}`);
            if (!voteResponse.ok) { setError("Fehler beim Abrufen der Votes."); return; }
            const voteData = await voteResponse.json();

            const alreadyVoted = voteData.find((v: Vote) => v.voterId === playerId);
            if (alreadyVoted) setVoteSubmitted(true);
        };

        fetchData();
    }, [gameId]);

    useEffect(() => {
        const fetchGameWords = async () => {
            try {
                const response = await fetch(`/api/playerword/${gameId}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });

                if (!response.ok) { setError(`Fehler vom Server bitte versuche es erneut!`); return; }

                const wordsData = await response.json();
                if (!wordsData || !Array.isArray(wordsData)) {
                    setError("Wörter konnten nicht gefunden werden.");
                    return;
                }

                setGameWords(wordsData);
            } catch {
                setError("Ein unbekannter Fehler ist aufgetreten.");
            }
        };

        fetchGameWords();
        socket.emit("joinVoting", gameId);

        socket.on("votingComplete", () => navigate(`/results/${gameId}`));

        return () => {
            socket.off("gameWords");
            socket.off("votingUpdate");
            socket.off("votingComplete");
        };
    }, [gameId, voteSubmitted, navigate]);

    const handleVote = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!selectedPlayer) { alert("Bitte wähle jemanden aus!"); return; }

        try {
            const votingData = { playerToken: currentPlayerToken, voted_for: selectedPlayer };

            const response = await fetch(`/api/vote/${gameId}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(votingData),
            });

            if (!response.ok) { setError("Fehler beim Abstimmen. Bitte versuche es später erneut."); return; }

            setVoteSubmitted(true);
            setSelectedPlayer("");
            socket.emit("voted", gameId);
        } catch {
            console.error("Abstimmen ist Fehlgeschlagen!");
        }
    };

    return (
        <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-8 max-md:p-4">

            {/* Header */}
            <div className="text-center mb-12 z-10 relative">
                <h1 className="text-h2 font-bold mb-2 voting-title-gradient">Wer ist der Impostor?</h1>
                <p className="text-body-lg text-app-sec font-light">Analysiere die Wörter und stimme ab</p>
            </div>

            {/* Inhalt */}
            <div className="w-full max-w-4xl z-10 relative flex flex-col gap-8">

                {voteSubmitted ? (
                    <div>
                        <div className="vote-submitted-card p-16 text-center">
                            <div className="text-h4 font-bold text-app-text mb-2">
                                Deine Stimme wurde abgegeben!
                            </div>
                            <div className="text-app-sec text-base">
                                Warte auf die anderen Spieler...
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="voting-form-card p-8">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="text-h4 font-semibold text-app-text">Wähle den Impostor</div>
                        </div>
                        <form onSubmit={handleVote}>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4 mb-8 max-lg:grid-cols-1">
                                {gameWords.map((wordEntry) => (
                                    <button
                                        type="button"
                                        key={wordEntry.playerToken}
                                        className={`player-option ${wordEntry.playerName === selectedPlayer ? "selected" : ""}`}
                                        onClick={() => setSelectedPlayer(wordEntry.playerName)}
                                    >
                                        <div className="player-radio" />
                                        <div className="text-app-text font-medium text-body-lg flex-1">
                                            {wordEntry.playerName}: {wordEntry.word}
                                        </div>
                                    </button>
                                ))}
                            </div>
                            <button
                                type="submit"
                                disabled={!selectedPlayer}
                                className="vote-button"
                            >
                                Abstimmen
                            </button>
                        </form>
                    </div>
                )}

                <ErrorDisplay error={error} setError={setError} />
            </div>
        </div>
    );
};

export default VotingPage;
