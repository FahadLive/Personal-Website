import "./app.css";
import {
    createBrowserRouter,
    createRoutesFromElements,
    Route,
    RouterProvider,
} from "react-router-dom";
import { lazy, Suspense } from "react";

import Layout from "./components/layout";
import { HelmetProvider } from "react-helmet-async";
import HomePage from "./pages/home";
import { Loading } from "./components/loading";

const ProjectsListPage = lazy(() => import("./pages/projectsList"));
const ProjectPage = lazy(() => import("./pages/project"));
const AboutPage = lazy(() => import("./pages/about"));
const BlogsListPage = lazy(() => import("./pages/blogsList"));
const BlogPage = lazy(() => import("./pages/blog"));
const ScratchpadPage = lazy(() => import("./pages/scratchpad"));
const BuildPage = lazy(() => import("./pages/build"));

function prefetchRoutes() {
    void import("./pages/projectsList");
    void import("./pages/project");
    void import("./pages/about");
    void import("./pages/blogsList");
    void import("./pages/blog");
    void import("./pages/scratchpad");
    void import("./pages/build");
}
if (typeof window !== "undefined") {
    const schedule =
        window.requestIdleCallback?.bind(window) ??
        ((cb: () => void) => window.setTimeout(cb, 1500));
    schedule(prefetchRoutes);
}
const NotFoundPage = lazy(() => import("./pages/notFound"));

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
