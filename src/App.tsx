import "./app.css";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "./components/layout";
import { SpinnerDiamond } from "spinners-react";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "./pages/home";

const Downloads = lazy(() => import("./pages/downloads"));
const ProjectsListPage = lazy(() => import("./pages/projectsList"));
const ProjectPage = lazy(() => import("./pages/project"));
const AboutPage = lazy(() => import("./pages/about"));
const BlogsListPage = lazy(() => import("./pages/blogsList"));
const BlogPage = lazy(() => import("./pages/blog"));
const ScratchpadPage = lazy(() => import("./pages/scratchpad"));
const BuildPage = lazy(() => import("./pages/build"));

// Warm every route chunk once the browser is idle so internal
// navigation never shows a spinner. setTimeout fallback for Safari.
function prefetchRoutes() {
    void import("./pages/projectsList");
    void import("./pages/project");
    void import("./pages/about");
    void import("./pages/blogsList");
    void import("./pages/blog");
    void import("./pages/scratchpad");
    void import("./pages/build");
    void import("./pages/downloads");
}
if (typeof window !== "undefined") {
    const schedule =
        window.requestIdleCallback?.bind(window) ??
        ((cb: () => void) => window.setTimeout(cb, 1500));
    schedule(prefetchRoutes);
}
const NotFoundPage = lazy(() => import("./pages/notFound"));

const Loading = () => (
    <div className="loading-container">
        <SpinnerDiamond color="#D42537" size={100} />
    </div>
);

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsListPage />} />
            <Route path="/project/:slug" element={<ProjectPage />} />
            <Route path="/blogs" element={<BlogsListPage />} />
            <Route path="/blog/:slug" element={<BlogPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/scratchpad" element={<ScratchpadPage />} />
            <Route path="/build" element={<BuildPage />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="*" element={<NotFoundPage />} />
        </Route>,
    ),
);

function App() {
    return (
        <HelmetProvider>
            <Suspense fallback={<Loading />}>
                <RouterProvider router={router} />
            </Suspense>
        </HelmetProvider>
    );
}

export default App;
