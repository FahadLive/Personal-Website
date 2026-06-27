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

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const rotations = [-0.8, 0.8, -0.5, 0.5, -0.8, 0.8];

const ProjectsListPage: React.FC = () => {
  const [projects, setProjects] = useState<ProjectsDataType[]>([]);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false,
  );

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

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
        <motion.div
          className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {projects.map((project, index) => (
            <motion.div
              key={project.slug}
              variants={itemVariants}
              style={
                isDesktop
                  ? { transform: `rotate(${rotations[index % rotations.length]}deg)` }
                  : {}
              }
            >
              <ProjectItem
                indexNum={(index + 1).toString().padStart(2, "0")}
                projectTags={project.tags}
                projectName={project.title}
                slug={project.slug}
              />
            </motion.div>
          ))}
        </motion.div>

        <Cat
          className="absolute right-4 bottom-4"
        />
      </div>
    </>
  );
};

export default ProjectsListPage;
