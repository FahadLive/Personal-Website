import "./page.css";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getProjectData } from "../utils/markdownParser";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/autoplay";

import { Autoplay } from "swiper/modules";
import TextTransition from "../components/transitionText";

import { AnimatePresence, motion } from "motion/react";
import {
  IconBrandGithub,
  IconChevronDown,
  IconChevronRight,
} from "@tabler/icons-react";
import Markdown from "react-markdown";
import { scrollToElement } from "../utils/pageNav";
import MetaComponent from "../components/meta";

interface ProjectsDataType {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
  content: string;
  githubLink: string | null;
  externalLink: string | null;
  coverImage: string | null;
  images: string[] | null;
}

const ProjectPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const path = useLocation();
  const navigate = useNavigate();
  const [project, setProject] = useState<ProjectsDataType | null>(null);
  const [loading, setLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const loadProject = async () => {
      if (!slug) {
        navigate("/projects", { state: { from: path } });
        return;
      }

      try {
        const projectData = await getProjectData(slug);
        if (!projectData) {
          navigate("/projects");
          return;
        }
        setProject(projectData);
      } catch (error) {
        console.error(`Failed to load project: ${slug}`, error);
        navigate("/projects");
      } finally {
        setLoading(false);
      }
    };

    loadProject();
  }, [slug, path]);

  useEffect(() => {
    if (showContent) {
      const timer = setTimeout(() => {
        scrollToElement("learn-more");
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [showContent]);

  useEffect(() => {
    if (project && project.images && project.images.length > 0) {
      const timer = setTimeout(() => {
        setImagesLoaded(true);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [project]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full justify-center text-center pt-40">
        <p className="text-[var(--tertiary)]">Loading project...</p>
      </div>
    );
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  return (
    <>
      <MetaComponent
        pageTitle={project.title}
        pageDescription={project.summary}
      />
      <div className="flex flex-col gap-6 min-h-screen overflow-x-hidden justify-center px-4 pt-28">
        {/* Content - Moved to the top */}
        <div className="flex h-fit md:justify-center">
          <div className="flex flex-col gap-6 md:justify-between w-full md:max-w-6xl">
            <div className="flex justify-center md:justify-start gap-1">
              {project.tags.map((tag, index) => (
                <div
                  key={index}
                  className="flex gap-1 text-[var(--tertiary)] font-light"
                >
                  <p>{tag.toUpperCase()}</p>

                  {!(index == project.tags.length - 1) && <p>•</p>}
                </div>
              ))}
            </div>
            <div className="flex flex-col md:flex-row gap-6 justify-start md:justify-between">
              <TextTransition
                styleName="project-page-name text-center md:text-left"
                revealSpeed={1}
                text={project.title.toUpperCase() + "."}
              />
              <div className="project-page-summary ">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="project-page-summary text-left md:text-end"
                >
                  {project.summary.toUpperCase()}
                </motion.div>
              </div>
            </div>

            <div className="flex flex-row gap-6 justify-between items-center pt-4">
              {project.content && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 1 }}
                  className="project-links flex justify-end gap-4 mt-2"
                >
                  {project.content && (
                    <div
                      onClick={() => setShowContent(!showContent)}
                      className="flex text-[var(--tertiary)] hover:scale-105 rounded-2xl cursor-pointer transition"
                    >
                      Learn More
                      {showContent ? <IconChevronDown /> : <IconChevronRight />}
                    </div>
                  )}
                </motion.div>
              )}

              {(project.githubLink || project.externalLink) && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 1 }}
                  className="project-links flex md:ml-auto gap-4 mt-2"
                >
                  {project.githubLink && (
                    <a
                      href={project.githubLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex bg-[var(--tertiary)] text-[var(--main)] hover:text-[var(--tertiary)] hover:bg-[var(--main)] hover:border-2 hover:border-[var(--tertiary)] p-3 rounded-4xl transition-colors"
                    >
                      <IconBrandGithub />
                      GitHub
                    </a>
                  )}
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* Section divider */}
        <div className="section-divider my-6">
          <span>✦</span>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto">
          {/* Images - Moved to the bottom and conditionally rendered */}
          {project.images && imagesLoaded && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="flex justify-center w-full mt-4"
            >
              <div className="w-full max-w-screen-xl">
                <Swiper
                  slidesPerView="auto"
                  spaceBetween={30}
                  loop={true}
                  speed={4000}
                  autoplay={{
                    delay: 0,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: false,
                  }}
                  modules={[Autoplay]}
                  className="w-full h-full"
                >
                  {project.images.length > 1
                    ? [
                        ...project.images,
                        ...project.images,
                        ...project.images,
                      ].map((projectImg, index) => (
                        <SwiperSlide
                          key={index}
                          className="max-h-[40vh] md:h-full md:!w-auto p-5"
                        >
                          <img
                            src={projectImg}
                            className="h-full object-contain rounded-md shadow-lg grain"
                            style={{ width: "auto", height: "100%" }}
                            alt={`Image ${index + 1} for ${project.title}`}
                          />
                        </SwiperSlide>
                      ))
                    : project.images.map((projectImg, index) => (
                        <SwiperSlide key={index} className="!w-auto">
                          <img
                            src={projectImg}
                            className="h-full object-contain rounded-md grain"
                            style={{ width: "auto", height: "100%" }}
                            alt={`Image ${index + 1} for ${project.title}`}
                          />
                        </SwiperSlide>
                      ))}
                </Swiper>
              </div>
            </motion.div>
          )}
          {project.content && (
            <div className="section-divider my-4">
              <span>▼</span>
            </div>
          )}
          <AnimatePresence>
            {project.content && showContent && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{ transformOrigin: "bottom", overflow: "hidden" }}
                className="flex mt-4 justify-center"
              >
                <div
                  id="learn-more"
                  className="project-info flex flex-col gap-2 md:max-w-6xl justify-center p-4"
                >
                  <Markdown>{project.content}</Markdown>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
};

export default ProjectPage;
