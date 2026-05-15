import type {Dispatch, SetStateAction} from "react";

interface ErrorDisplayProps {
    error: string | null | undefined;
    setError: Dispatch<SetStateAction<string | null | undefined>>;
}

function ErrorDisplay({error, setError}: Readonly<ErrorDisplayProps>) {
    if (!error) {
        return
    }
    return (
        <div className="error-message">
            <div className="error-content">
                <p className="error-text">{error}</p>
            </div>
            <button
                className="error-remove-button"
                onClick={() => setError(null)}
                aria-label="Fehlermeldung schliessen"
            >
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M6.225 4.811a1 1 0 0 0-1.414 1.414L10.586 12 4.81 17.775a1 1 0 1 0 1.414 1.414L12 13.414l5.775 5.775a1 1 0 0 0 1.414-1.414L13.414 12l5.775-5.775a1 1 0 0 0-1.414-1.414L12 10.586 6.225 4.81z"
                        fill="currentColor"
                    />
                </svg>
            </button>
        </div>
    )
}

export default ErrorDisplay
