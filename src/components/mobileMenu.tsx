import { IconMenu, IconX } from "@tabler/icons-react";
import React, { useState, useEffect } from "react";
import NavLinks from "./navLinks";
import PageDirectButton from "./pageDirects";

const MobileMenu: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [windowHeight, setWindowHeight] = useState<number>(0);

  useEffect(() => {
    const updateHeight = () => {
      setWindowHeight(window.innerHeight);
    };

    // Set height initially
    updateHeight();

    // Update height on resize and orientation change
    window.addEventListener("resize", updateHeight);
    window.addEventListener("orientationchange", updateHeight);

    // Cleanup
    return () => {
      window.removeEventListener("resize", updateHeight);
      window.removeEventListener("orientationchange", updateHeight);
    };
  }, []);

  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <div className="z-[100] bg-[var(--tertiary)] hover:bg-[var(--text)] p-2 rounded-[50%] transition">
      <IconMenu
        className={`md:hidden h-6 w-6 cursor-pointer transition-opacity text-[var(--main)] duration-300 ${
          isOpen ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
        onClick={() => setIsOpen(true)}
      />
      {/* Mobile Menu Overlay */}
      <div
        style={{ height: windowHeight ? `${windowHeight}px` : "100vh" }}
        className={`fixed top-0 left-0 w-screen bg-[var(--main)] p-6 transition-all duration-300 ease-in-out ${
          isOpen
            ? "opacity-100 translate-x-0"
            : "opacity-0 translate-x-full pointer-events-none"
        }`}
      >
        <div className="flex flex-col h-full p-3">
          <div className="flex justify-end p-2">
            <IconX
              className="h-6 w-6 cursor-pointer transition-transform duration-300 hover:rotate-90"
              onClick={() => setIsOpen(false)}
            />
          </div>

          <div className="flex flex-col justify-between h-full">
            {/* Buttons on the top */}
            <div className="text-center space-y-6 py-6">
              <NavLinks
                indexNum="01"
                text="About"
                link="/about"
                onClick={handleLinkClick}
              />
            </div>
            <div className="page-directs flex justify-between items-center">
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileMenu;
