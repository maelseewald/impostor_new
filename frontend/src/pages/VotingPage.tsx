/**
 * Author: Maël Seewald
 * Date: 2025-06-25
 * Version: 1.0
 * Description: VotingPage component for the game, where players can vote for the impostor based on submitted words.
 */

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import socket from '../socket';
import '../styles/VotingPage.css';
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


    // Check game status and redirect if necessary
    useEffect(() => {
        checkGameStatusAndRedirect(gameId, navigate, setError);
        socket.emit("updateLobby", gameId);
    }, [gameId, navigate]);

    useEffect(() => {
        const fetchData = async () => {
            const playerToken = localStorage.getItem("playerToken");

            const playerResponse = await fetch(`/api/player/${gameId}`);
            if (!playerResponse.ok) {
                setError("Fehler beim Abrufen der Spieler.");
                return;
            }
            const playersData = await playerResponse.json();

            const player = playersData.find((p: Player) => p.playerToken === playerToken);
            if (!player) {
                setError("Spieler mit Token nicht gefunden.");
                return;
            }
            const playerId = player.playerId;

            const voteResponse = await fetch(`/api/vote/get/${gameId}`);
            if (!voteResponse.ok) {
                setError("Fehler beim Abrufen der Votes.");
                return;
            }
            const voteData = await voteResponse.json();

            const alreadyVoted = voteData.find((v: Vote) => v.voterId === playerId);
            if (alreadyVoted) {
                setVoteSubmitted(true);
            }
        };

        fetchData();
    }, [gameId]);


    useEffect(() => {
        const fetchGameWords = async () => {
            try {
                const response = await fetch(
                    `/api/playerword/${gameId}`,
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    setError(`Fehler vom Server bitte versuche es erneut!`);
                    return;
                }

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


        socket.on("votingComplete", () => {
                navigate(`/results/${gameId}`);
        });

        return () => {
            socket.off("gameWords");
            socket.off("votingUpdate");
            socket.off("votingComplete");
        };
    }, [gameId, voteSubmitted, navigate]);

    // Handle voting submission
    const handleVote = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!selectedPlayer) {
            alert("Bitte wähle jemanden aus!");
            return;
        }


        try {
            const votingData = {
                playerToken: currentPlayerToken,
                voted_for: selectedPlayer,
            };

            const response = await fetch(
                `/api/vote/${gameId}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(votingData),
                }
            );

            if (!response.ok) {
                setError("Fehler beim Abstimmen. Bitte versuche es später erneut.");
                return;
            }


            setVoteSubmitted(true);
            setSelectedPlayer("");
            socket.emit("voted", gameId);

        } catch {
            console.error("Abstimmen ist Fehlgeschlagen!");
        }
    };

    // Show the  voting page content
    return (
      <div className="voting-page initial-background-color">
            {/* Header */}
            <div className="voting-header">
                <h1 className="voting-title"> Wer ist der Impostor?</h1>
                <p className="voting-subtitle">Analysiere die Wörter und stimme ab</p>
            </div>

            {/* Main Content */}
            <div className="voting-content">

                {/* Voting Section */}
                {voteSubmitted ? (
                    <div>
                        <div className="vote-submitted-card">

                            <div className="vote-submitted-title">
                                Deine Stimme wurde abgegeben!
                            </div>
                            <div className="vote-submitted-text">
                                Warte auf die anderen Spieler...
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="voting-form-card">
                        <div className="voting-form-header">
                            <div className="voting-form-title">Wähle den Impostor</div>
                        </div>
                        <form onSubmit={handleVote}>
                                <div className="players-grid-voting">
                                    {gameWords.map((wordEntry) => (
                                        <button
                                            type="button"
                                            key={wordEntry.playerToken}
                                            className={`player-option ${
                                                wordEntry.playerName === selectedPlayer ? "selected" : ""
                                            }`}
                                            onClick={() => setSelectedPlayer(wordEntry.playerName)}
                                        >
                                            <div className="player-radio"></div>
                                            <div
                                                className="player-option-name">{wordEntry.playerName}: {wordEntry.word}</div>
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
                <ErrorDisplay error={error} setError={setError}/>
            </div>
        </div>
    );
};

export default VotingPage;
