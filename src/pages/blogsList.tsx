import { useEffect, useState } from "react";
import { getBlogList } from "../utils/markdownParser";
import { motion } from "motion/react";
import MetaComponent from "../components/meta";
import BlogItem from "../components/blogItem";

interface BlogsDataType {
  slug: string;
  title: string;
  date: string;
  summary: string;
  tags: string[];
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

const rotations = [1.2, -0.8, 0.5, -1, 0.8, -0.5];

const BlogsListPage: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogsDataType[]>([]);
  const [isDesktop, setIsDesktop] = useState(
    typeof window !== "undefined" ? window.innerWidth >= 768 : false,
  );

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const processBlogssData = async () => {
    setBlogs(await getBlogList());
  };

  useEffect(() => {
    processBlogssData();
  }, []);

  return (
    <>
      <MetaComponent
        pageTitle="Blogs"
        pageDescription="List of blogs made by Fahad"
      />
      <div className="min-h-dvh p-8 pt-28">
        <motion.div
          className="grid gap-6 md:grid-cols-2 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {blogs.map((blog, index) => (
            <motion.div
              key={blog.slug}
              variants={itemVariants}
              style={
                isDesktop
                  ? { transform: `rotate(${rotations[index % rotations.length]}deg)` }
                  : {}
              }
            >
              <BlogItem
                indexNum={(index + 1).toString().padStart(2, "0")}
                blogTags={blog.tags}
                blogTitle={blog.title}
                slug={blog.slug}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </>
  );
};

export default BlogsListPage;
