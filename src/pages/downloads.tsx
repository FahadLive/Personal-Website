function Downloads() {
  return (
    <div className="min-h-dvh flex items-center justify-center p-8 pt-28">
      <div className="paper-card p-8 md:p-10 max-w-md w-full text-center">
        <div className="font-hand text-sm opacity-60 mb-2">
          ← grab a copy
        </div>
        <a
          href="/dino-game-assets.zip"
          download="DinoGameAssets.zip"
          className="group inline-flex items-center gap-3 text-lg font-semibold underline underline-offset-4 decoration-[var(--tertiary)] decoration-2 hover:decoration-4 transition-all"
        >
          <span>Download Dino Game Assets</span>
          <span className="group-hover:translate-x-1 transition-transform">↓</span>
        </a>
        <div className="mt-6 text-xs opacity-40 font-hand">
          a little something from the archive
        </div>
      </div>
    </div>
  );
}

export default Downloads;
