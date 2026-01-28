import socket from "../socket.ts";
import type {Dispatch, SetStateAction} from "react";
import type {NavigateFunction} from "react-router-dom";

const handleLeaveGame = async (currentPlayerToken: string | null, setError: Dispatch<SetStateAction<string | null | undefined>>, gameId: string | undefined, navigate: NavigateFunction) => {
    try {

        const res = await fetch(
            `/api/player/delete/${currentPlayerToken}`,
            {
                method: "DELETE",
            }
        );

        if (!res.ok) {
            const errorData = await res.json();
            console.error("Fehler beim Verlassen des Spiels:", errorData);
            setError("Fehler beim Verlassen der Lobby");
            return;
        }

        const data = await res.json();

        if (data.game_deleted) {
            socket.emit("notifyGameDeleted", data.game_id);
            setError(
                "Du hast als Host die Lobby verlassen. Das Spiel wurde beendet."
            );
        } else {
            socket.emit("updateLobby", gameId);
        }

        navigate(`/`);
    } catch (err) {
        console.error("Fehler beim Verlassen:", err);
        if (err instanceof Error) {
            setError(`Fehler: ${err.message}`);
        } else {
            setError("Ein unbekannter Fehler ist aufgetreten.");
        }
    }
};
export {handleLeaveGame}
