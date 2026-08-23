import { Link } from "react-router-dom";
import MetaComponent from "../components/meta";

const NotFoundPage: React.FC = () => {
    return (
        <>
            <MetaComponent
                pageTitle="404 — Not Found"
                pageDescription="This page doesn't exist."
            />
            <div className="relative min-h-dvh flex flex-col items-center justify-center gap-4 p-8">
                <div className="text-6xl font-bold text-[var(--text)]">404</div>
                <p className="text-[var(--text)]/60">
                    This page doesn't exist, or it wandered off somewhere.
                </p>
                <Link
                    to="/"
                    className="text-[var(--tertiary)] underline underline-offset-4"
                >
                    Back home
                </Link>
            </div>
        </>
    );
};

export default NotFoundPage;
