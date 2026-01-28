import {LeaveIcon} from "./icons/LeaveIcon.tsx";

interface LeaveButtonProps {
    isHost: boolean,
    handleOnClick: () => void
}

function LeaveButton({isHost, handleOnClick}: Readonly<LeaveButtonProps>) {
    return (
        <button
            onClick={handleOnClick}
            className="liquid-glass-button liquid-glass-button-red"
        >
            <LeaveIcon/>
            {isHost ? "Lobby Schliessen" : "Spiel Verlassen"}
        </button>
    )
}

export default LeaveButton
