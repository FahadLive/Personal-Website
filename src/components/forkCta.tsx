export default function ForkCta() {
    return (
        <div
            className="rounded-[6px] p-6 mt-12 text-center"
            style={{
                border: "1px dashed rgba(17,17,17,0.2)",
                boxShadow: "2px 4px 12px rgba(0,0,0,0.07)",
            }}
        >
            <h3 className="font-hand text-[22px] text-ink mb-2">
                want to build in public too?
            </h3>
            <p
                className="font-sans text-ink/60 leading-snug mx-auto mb-4"
                style={{ fontSize: "14px", maxWidth: "400px" }}
            >
                this page is just YAML files + a template. fork it, swap the
                content, ship your own.
            </p>
            <a
                href="/BUILD_IN_PUBLIC.md"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block font-sans font-medium text-[14px] text-accent
                           border border-accent/30 rounded-full px-5 py-2
                           transition-colors duration-200
                           hover:bg-accent hover:text-white"
            >
                read the guide →
            </a>
        </div>
    );
}
