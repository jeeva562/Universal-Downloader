import downloadIcon from '@/assets/download-icon.png';

const Hero = () => {
  return (
    <div className="text-center mb-12 sm:mb-16">
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="p-5 sm:p-6 rounded-full glow-effect smooth-transition hover:scale-110 animate-float">
          <img
            src={downloadIcon}
            alt="Download Icon"
            className="w-12 h-12 sm:w-16 sm:h-16"
          />
        </div>
      </div>

      <div className="w-full" style={{ background: 'transparent' }}>
        <h1
          className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-foreground mb-3 sm:mb-4 px-4"
          style={{
            background: 'none',
            backgroundColor: 'transparent',
            textShadow: 'none',
            boxShadow: 'none'
          }}
        >
          Universal Downloader
        </h1>
      </div>

      <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-2 sm:mb-3 max-w-2xl mx-auto px-4">
        Download videos, audio, and images from any platform instantly
      </p>

      <p className="text-xs sm:text-sm text-muted-foreground/80 max-w-xl mx-auto px-4">
        No registration required • Direct download to your device • Privacy-focused
      </p>

      {/* Feature Pills */}
      <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-2 sm:gap-3 px-4">
        <span className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-primary smooth-transition hover:scale-105">
          ✨ 4K Quality
        </span>
        <span className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-primary smooth-transition hover:scale-105">
          🎵 Audio Downloads
        </span>
        <span className="glass-card px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm text-primary smooth-transition hover:scale-105">
          🚀 Lightning Fast
        </span>
      </div>
    </div>
  );
};

export default Hero;