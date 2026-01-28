import type {Dispatch, SetStateAction} from "react";
import type {NavigateFunction} from "react-router-dom";

async function checkGameStatusAndRedirect(gameId: string | undefined, navigate: NavigateFunction, setError: Dispatch<SetStateAction<string | null | undefined>>) {
    try {
        const gameres = await fetch(
            `/api/game/${gameId}`,
            {
                method: "GET",
                headers: {"Content-Type": "application/json"},
            }
        );

        if (!gameres.ok) {
            throw new Error("Fehler beim Laden des Spiels");
        }

        const gameData = await gameres.json();

        switch (gameData.status) {
            case "LOBBY":
                break;
            case "PLAYING":
                navigate(`/game/${gameId}`);
                break;
            case "VOTING":
                navigate(`/voting/${gameId}`);
                break;
            case "COMPLETED":
                navigate(`/results/${gameId}`);
                break;
            default:
                setError("Unbekannter Spielstatus. Bitte versuche es später erneut.");
                break;
        }
    } catch (err) {
        if (err instanceof Error) {
            console.error("Fehler beim Erstellen oder Beitreten:", err);
            setError(err.message);
        } else {
            setError("Ein unbekannter Fehler ist aufgetreten.");
        }
    }
}

export {checkGameStatusAndRedirect}
