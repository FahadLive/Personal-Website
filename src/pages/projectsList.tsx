import { useEffect, useState } from "react";
import ProjectItem from "../components/projectItem";
import { getProjectList } from "../utils/markdownParser";
import { motion } from "motion/react";
import MetaComponent from "../components/meta";
import Cat from "../components/creatures/cat";

interface ProjectsDataType {
    slug: string;
    title: string;
    date: string;
    summary: string;
    tags: string[];
    githubLink: string | null;
    externalLink: string | null;
    coverImage: string | null;
}

const rotations = [-0.8, 0.8, -0.5, 0.5, -0.8, 0.8];

const ProjectsListPage: React.FC = () => {
    const [projects, setProjects] = useState<ProjectsDataType[]>([]);

    const processProjectsData = async () => {
        setProjects(await getProjectList());
    };

    useEffect(() => {
        processProjectsData();
    }, []);

    return (
        <>
            <MetaComponent
                pageTitle="Projects"
                pageDescription="List of projects made by Fahad"
            />
            <div className="relative min-h-dvh p-8 pt-28">
                <div className="columns-1 md:columns-2 xl:columns-3 gap-4 md:gap-6">
                    {projects.map((project, index) => (
                        <div
                            key={project.slug}
                            className="mb-6 md:mb-8 break-inside-avoid"
                        >
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{
                                    duration: 0.4,
                                    delay: Math.min(index * 0.025, 0.15),
                                    ease: "easeOut",
                                }}
                                style={{
                                    rotate: rotations[index % rotations.length],
                                }}
                            >
                                <ProjectItem
                                    indexNum={(index + 1)
                                        .toString()
                                        .padStart(2, "0")}
                                    projectTags={project.tags}
                                    projectName={project.title}
                                    slug={project.slug}
                                    coverImage={project.coverImage}
                                    summary={project.summary}
                                />
                            </motion.div>
                        </div>
                    ))}
                </div>

                <Cat className="absolute right-2 bottom-2" />
            </div>
        </>
    );
};

export default ProjectsListPage;
