import { Outlet } from "react-router-dom";
import Header from "./header";
import BackgroundDecorations from "./backgroundDecorations";
import CustomCursor from "./customCursor";

function Layout() {
    return (
        <div className="relative w-full min-h-dvh bg-surface">
            <BackgroundDecorations />
            {/*<PaperClip />*/}
            <Header />
            <CustomCursor />
            <main className="grid z-[1] w-full">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
