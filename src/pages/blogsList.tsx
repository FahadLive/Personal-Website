import { useEffect, useState } from "react";
import { getBlogList } from "../utils/markdownParser";
import { motion } from "motion/react";
import MetaComponent from "../components/meta";
import BlogItem from "../components/blogItem";
import Snail from "../components/creatures/snail";

interface BlogsDataType {
    slug: string;
    title: string;
    date: string;
    summary: string;
    tags: string[];
    coverImage: string | null;
}

const rotations = [0.2, -0.4, 0.6, -0.1, 0.5, -0.5];

const BlogsListPage: React.FC = () => {
    const [blogs, setBlogs] = useState<BlogsDataType[]>([]);

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
            <div className="relative min-h-dvh p-8 pt-28">
                <div className="columns-1 md:columns-2 xl:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8 [&>*]:break-inside-avoid">
                    {blogs.map((blog, index) => (
                        <motion.div
                            key={blog.slug}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.5,
                                ease: "easeOut",
                                delay: index * 0.05,
                            }}
                            style={{
                                transform: `rotate(${rotations[index % rotations.length]}deg)`,
                            }}
                        >
                            <BlogItem
                                indexNum={(index + 1)
                                    .toString()
                                    .padStart(2, "0")}
                                blogTags={blog.tags}
                                blogTitle={blog.title}
                                slug={blog.slug}
                                coverImage={blog.coverImage}
                                summary={blog.summary}
                            />
                        </motion.div>
                    ))}
                </div>

                <Snail className="absolute right-4 bottom-4" />
            </div>
        </>
    );
};

export default BlogsListPage;
