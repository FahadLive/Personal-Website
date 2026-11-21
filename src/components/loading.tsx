import { SpinnerDiamond } from "spinners-react";

export const Loading = () => (
    <div className="loading-container" role="status" aria-label="Loading">
        <SpinnerDiamond color="#D42537" size={100} />
    </div>
);
