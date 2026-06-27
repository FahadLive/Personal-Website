import "./page.css";

import { motion } from "motion/react";
import MetaComponent from "../components/meta";

const timeline = [
  {
    year: "2019",
    label: "Started coding",
    icon: "▸",
  },
  {
    year: "2022",
    label: "Open Source",
    icon: "✦",
  },
  {
    year: "2025",
    label: "Building products",
    icon: "⚡",
  },
  {
    year: "Now",
    label: "Pushing pixels & perfecting craft",
    icon: "●",
  },
];

function AboutPage() {
  return (
    <>
      <MetaComponent
        pageTitle="About"
        pageDescription="All about Fahad - A passionate developer"
      />
      <div className="min-h-dvh p-8 pt-28">
        {/* Bio section */}
        <div className="grid md:grid-cols-[1.5fr_1fr] gap-8 pb-16">
          <div className="about-page gap-6">
            <h1 className="about-head">
              A little bit <span className="about-me">about me .</span>
            </h1>
            <p className="pt-6 md:mr-48">
              I'm a student currently pursuing a bachelors in computer science &
              engineering at GEC Palakkad. I'm a self taught developer who loves
              to build things that actually matters!
            </p>
            <br />
            <p>
              Honestly, I love what I do. And this site is a product of my passion
              :D
            </p>
          </div>
          <div className="overflow-hidden rounded-xl">
            <img
              src="/fahads-photo.jpg"
              loading="lazy"
              alt="Fahad's Portrait photo"
              draggable={false}
            />
          </div>
        </div>

        {/* Timeline section */}
        <motion.div
          className="border-t border-[var(--tertiary)]/20 pt-10 pb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="about-subheadings text-xl mb-8">
            Timeline
          </h2>

          <div className="relative">
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className="flex gap-4 pb-8 last:pb-0 relative"
                initial={{ opacity: 0, x: -16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: index * 0.15, duration: 0.5 }}
              >
                {/* Timeline line (connecting all dots) */}
                {index < timeline.length - 1 && (
                  <svg
                    className="absolute left-[18px] top-5 h-full w-[2px]"
                    aria-hidden="true"
                  >
                    <line
                      x1="1"
                      y1="0"
                      x2="1"
                      y2="100%"
                      className="timeline-line"
                      strokeDasharray="4 3"
                    />
                  </svg>
                )}

                {/* Year + Dot */}
                <div className="flex flex-col items-center gap-1 min-w-[48px]">
                  <div className="w-[10px] h-[10px] rounded-full bg-[var(--tertiary)]" />
                  <div className="timeline-year">{item.year}</div>
                </div>

                {/* Label */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="timeline-icon">{item.icon}</span>
                  <span className="timeline-label">{item.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Contact section */}
        <div className="border-t border-[var(--tertiary)]/20 pt-8">
          <h2 className="about-subheadings">Contacts</h2>
          <p>
            <a
              className="underline underline-offset-4"
              href="https://instagram.com/ranger_nf"
            >
              ranger_nf on Instagram
            </a>{" "}
            <span className="about-side-note">(preferred)</span>
            <br />
            <span>or message me on LinkedIn</span>
          </p>

          <h2 className="about-subheadings">About this site</h2>
          <p>
            The design of this site was heavily inspired by:
            <br />
            <br />
            <a
              className="underline underline-offset-4"
              href="https://wandixu.com/"
              target="_blank"
            >
              wandixu.com
            </a>{" "}
            <span className="about-side-note">(She built a masterpiece!)</span>
            <br />
            <a
              className="underline underline-offset-4"
              href="https://scalzodesign.be/"
              target="_blank"
            >
              scalzodesign.be
            </a>{" "}
            <span className="about-side-note">(Again, a goated site)</span>
            <br />
          </p>
        </div>
      </div>
    </>
  );
}

export default AboutPage;
