export default function ForkCta() {
    return (
        <section className="mt-12 rounded-xl border border-dashed border-black/15 bg-paper p-5 md:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                <div className="max-w-xl text-left">
                    <p className="font-hand text-[22px] text-ink">
                        want to build in public too?
                    </p>

                    <p className="mt-2 font-sans text-[14px] leading-relaxed text-ink/70">
                        I built this page around a simple GitHub + Telegram
                        workflow that lets me publish updates in seconds. If
                        you'd like to create something similar, I've documented
                        the entire setup—from the worker to the automation.
                    </p>
                </div>

                <a
                    href="https://github.com/FahadLive/Personal-Website/blob/main/BUILD_IN_PUBLIC.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full border border-accent/30 px-5 py-2.5 font-sans text-[14px] font-medium text-accent transition-all duration-200 hover:-translate-y-0.5 hover:bg-accent hover:text-white"
                >
                    Read the guide
                    <span className="transition-transform duration-200 group-hover:translate-x-1">
                        →
                    </span>
                </a>
            </div>
        </section>
    );
}
