import { Download, Zap, Music, Gamepad2 } from 'lucide-react';

const Hero = () => {
  return (
    <div className="text-center mb-12 sm:mb-16 relative">
      {/* Floating download icon with neon glow */}
      <div className="flex justify-center mb-6 sm:mb-8">
        <div className="relative p-5 sm:p-6 rounded-lg glass-card cyber-corners animate-float">
          <Download className="w-12 h-12 sm:w-16 sm:h-16 text-primary animate-pulse-glow" />
          {/* Corner decorations */}
          <div className="absolute -top-1 -left-1 w-3 h-3 border-t-2 border-l-2 border-primary"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 border-t-2 border-r-2 border-primary"></div>
          <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b-2 border-l-2 border-primary"></div>
          <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b-2 border-r-2 border-primary"></div>
        </div>
      </div>

      {/* Cyber title with gradient */}
      <div className="w-full mb-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight cyber-title animate-neon-flicker">
          UNIVERSAL
        </h1>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-primary text-glow mt-1">
          DOWNLOADER
        </h1>
      </div>

      {/* Subtitle with retro feel */}
      <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-2 sm:mb-3 max-w-2xl mx-auto px-4 font-mono">
        &gt; Download videos, audio, and images from any platform_
      </p>

      <p className="text-xs sm:text-sm text-primary/60 max-w-xl mx-auto px-4 font-mono tracking-wider">
        [ NO REGISTRATION ] • [ DIRECT DOWNLOAD ] • [ PRIVACY FOCUSED ]
      </p>

      {/* Gaming-style feature pills */}
      <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4 px-4">
        <div className="glass-card px-4 sm:px-5 py-2 sm:py-3 rounded-none border-l-4 border-l-primary smooth-transition hover:scale-105 hover:border-l-accent flex items-center gap-2 cyber-corners">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm text-foreground font-mono uppercase tracking-wider">4K Quality</span>
        </div>
        <div className="glass-card px-4 sm:px-5 py-2 sm:py-3 rounded-none border-l-4 border-l-primary smooth-transition hover:scale-105 hover:border-l-accent flex items-center gap-2 cyber-corners">
          <Music className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm text-foreground font-mono uppercase tracking-wider">Audio Extract</span>
        </div>
        <div className="glass-card px-4 sm:px-5 py-2 sm:py-3 rounded-none border-l-4 border-l-primary smooth-transition hover:scale-105 hover:border-l-accent flex items-center gap-2 cyber-corners">
          <Gamepad2 className="w-4 h-4 text-primary" />
          <span className="text-xs sm:text-sm text-foreground font-mono uppercase tracking-wider">Fast Mode</span>
        </div>
      </div>

      {/* Status bar */}
      <div className="mt-8 flex justify-center items-center gap-3 text-xs font-mono text-primary/50">
        <div className="flex items-center gap-2">
          <div className="status-online"></div>
          <span>SYSTEM ONLINE</span>
        </div>
        <span className="text-primary/30">|</span>
        <span>v2.0</span>
      </div>
    </div>
  );
};

export default Hero;