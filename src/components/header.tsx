import React, { useEffect, useState } from "react";
import MobileMenu from "./mobileMenu";
import PageDirectButton from "./pageDirects";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IconArrowLeft } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";

const Header: React.FC = () => {
  const [isHomePage, setIsHomePage] = useState<boolean>(true);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsHomePage(location.pathname === "/");
  }, [location]);

  return (
    <div
      className={`fixed flex w-full p-6 z-[50] overflow-hidden ${!isHomePage && isScrolled && "bg-[var(--main)]"} rounded-lg transition`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={isHomePage.toString()}
          initial={{ y: "-200%" }}
          animate={{ y: "0%" }}
          exit={{ y: "-200%" }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex w-full flex-row justify-between items-center"
        >
          {!isHomePage && (
            <div className="flex justify-start pt-1">
              <Link to={location.state?.from || "/"}>
                <IconArrowLeft className="text-[var(--tertiary)] w-10 h-10 group-hover:scale-105" />
              </Link>
            </div>
          )}

          <div
            className="flex hover:cursor-pointer items-center p-2"
            onClick={() => navigate("/")}
          >
            <img
              src="/logo.svg"
              alt="Logo Icon"
              className={`${!isHomePage && "md:absolute md:left-[50%]"} h-11 w-11 md:h-12 md:w-12`}
            />
          </div>

          <div className="md:hidden p-3">
            <MobileMenu />
          </div>

          <div className="page-directs hidden md:flex h-max items-center gap-16">
            <Link className="nav-bar-item" to="/about">
              about
            </Link>
            <a
              className="nav-bar-item"
              target="_blank"
              href="https://linkedin.com/in/just-fahad/"
            >
              linkedin
            </a>
            <PageDirectButton
              text="github"
              link="https://github.com/FahadLive"
            />
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Header;
