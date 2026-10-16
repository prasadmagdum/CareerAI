import { BrainCircuit } from "lucide-react";
import "./LoadingState.css";

function LoadingState({ message = "Loading..." }) {
    return (
        <div className="loading-state" role="status" aria-live="polite">
            <div className="loading-spinner">
                <span className="loading-orbit" aria-hidden="true" />
                <BrainCircuit size={25} aria-hidden="true" />
            </div>

            <p>{message}</p>
        </div>
    );
}

export default LoadingState;