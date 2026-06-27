import "./page.css";

import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { getBlogData } from "../utils/markdownParser";

import MetaComponent from "../components/meta";
import Markdown from "react-markdown";

interface ProjectsDataType {
  slug: string;
  title: string;
  date: Date;
  summary: string;
  tags: string[];
  content: string;
  coverImage: string | null;
}

const ProjectPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const path = useLocation();
  const navigate = useNavigate();
  const [blog, setProject] = useState<ProjectsDataType | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlog = async () => {
      if (!slug) {
        navigate("/blogs", { state: { from: path } });
        return;
      }

      try {
        const blogData = await getBlogData(slug);
        if (!blogData) {
          console.error(`No Data for slug: ${slug}`);
          navigate("/blogs");
          return;
        }
        setProject(blogData);
      } catch (error) {
        console.error(`Failed to load blog: ${slug}`, error);
        navigate("/blogs");
      } finally {
        setLoading(false);
      }
    };

    loadBlog();
  }, [slug, path]);

  if (loading) {
    return (
      <div className="flex min-h-screen w-full justify-center text-center pt-40">
        <p className="text-[var(--tertiary)]">Loading blog...</p>
      </div>
    );
  }

  if (!blog) {
    return <div>Blog not found</div>;
  }

  return (
    <>
      <MetaComponent
        pageTitle={blog.title}
        pageDescription={blog.summary}
        pagePreview={blog.coverImage ? blog.coverImage : null}
      />
      <div className="max-w-4xl mx-auto pt-28 px-8 md:px-10 pb-16">
        <div className="flex flex-col gap-3 pb-6">
          <div className="text-sm opacity-50 font-sans">{blog.date.toDateString().split(" ").slice(1).join(" ")}</div>
          <h1 className="font-serif text-3xl md:text-4xl leading-tight">
            {blog.title}.
          </h1>
        </div>
        <hr className="border-[var(--tertiary)]/20" />
        <div className="blog-content pt-6">
          <Markdown>{blog.content}</Markdown>
        </div>
      </div>
    </>
  );
};

export default ProjectPage;
