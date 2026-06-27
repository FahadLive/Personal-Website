import { Outlet } from "react-router-dom";
import Header from "./header";
import BackgroundDecorations from "./backgroundDecorations";
function Layout() {
    return (
        <div className="relative w-full min-h-dvh bg-surface">
            <BackgroundDecorations />
            <Header />
            <main className=" grid z-[1] w-full">
                <Outlet />
            </main>
        </div>
    );
}

export default Layout;
