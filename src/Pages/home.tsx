import "./page.css";

import NavLinks from "../components/navLinks";
import Tagline from "../components/tagline";
import TextTransition from "../components/transitionText";
import PageDirectButton from "../components/pageDirects";
import MetaComponent from "../components/meta";

function HomePage() {
  return (
    <>
      <MetaComponent
        pageTitle="Home"
        pageDescription="Hi, I’m  Mohammed Fahad, a passionate student who loves turning ideas into impactful digital experiences.
        This is where I share:
            🚀 Projects I’ve built
            🌱 Things I’m exploring right now in tech, design, and life

        I'm always learning, building, and pushing myself to the next level.
        Feel free to look around — and if something inspires you, let’s connect!"
      />
      <div className="flex flex-col min-h-dvh p-8">
        {/* <video
          autoPlay
          muted
          loop
          id="myVideo"
          className="hidden md:block md:fixed right-0 top-0 min-w-full min-h-full -z-5"
          src="noodle.webm"
        /> */}

        {/* Mobile view */}
        <div className="flex h-full md:hidden flex-col justify-between gap-16 pt-30 pb-10 ">
          <div>
            <Tagline text="BASED IN KERALA, INDIA" />
            <div className="main-contents gap-2 pt-3 pb-3">
              <TextTransition styleName="name-role-text" text="M. FAHAD" />
              <TextTransition styleName="adjective" text="THOUGHT-DRIVEN" />
              <TextTransition styleName="name-role-text" text="DEVELOPER." />
            </div>
            <div className="flex flex-col gap-3">
              <Tagline text="B.TECH CSE STUDENT" />
              <Tagline text="FULL STACK DEVELOPER" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <PageDirectButton text="projects" link="/projects" />
            <PageDirectButton text="blogs" link="/blogs" />
          </div>
        </div>

        {/* Laptop view */}
        <div className="hidden md:flex h-full items-center">
          <div className="main-content hidden md:block mx-auto">
            {/* Top row */}
            <div className="flex items-center gap-4">
              <TextTransition
                styleName="name-role-text"
                text="MOHAMMED FAHAD"
              />
              <div className="flex items-center">
                <Tagline text="BASED IN KERALA, INDIA" />
              </div>
            </div>

            {/* Middle and bottom sections with two-column layout */}
            <div className="flex">
              {/* Left column with stacked items aligned to the left */}
              <div className="flex flex-col gap-2 w-2/5">
                <div className="whitespace-nowrap">
                  <Tagline text="B.TECH CSE STUDENT" />
                  <Tagline text="FULL STACK DEVELOPER" />
                </div>
              </div>

              {/* Right column */}
              <div className="w-3/5 lap-content ">
                <div className="whitespace-nowrap">
                  <TextTransition
                    styleName="adjective"
                    text="THOUGHT-DRIVEN"
                    delay={500}
                  />
                </div>
                <TextTransition
                  styleName="name-role-text"
                  text="DEVELOPER."
                  delay={500}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center h-fit md:justify-between">
          <div className="hidden md:flex flex-col justify-end gap-3">
            <NavLinks indexNum="01" text="Projects" link="/projects" />
            <NavLinks indexNum="02" text="Blogs" link="/blogs" />
          </div>
          {typeof window !== "undefined" && (
            <div className="flex flex-col justify-between">
              <div></div>
              <a
                href="https://github.com/FahadLive/personal-website"
                className="flex justify-center font-light text-xs items-end "
              >
                MADE OPENLY BY FAHAD
              </a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default HomePage;
