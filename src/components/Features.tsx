import { Shield, Zap, Download, Globe } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Lightning Fast",
      description: "Download your media in seconds with our optimized servers"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Privacy First",
      description: "No data stored, no tracking, no registration required"
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "Multiple Formats",
      description: "Support for MP4, MP3, JPEG, PNG, WebM, and more"
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Universal Support",
      description: "Works with YouTube, TikTok, Instagram, Twitter, and more"
    }
  ];

  return (
    <div className="mt-12 sm:mt-16 px-4 sm:px-6">
      <h2 className="text-2xl sm:text-3xl font-bold text-center text-foreground mb-6 sm:mb-8">
        Why Choose Our Downloader?
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="glass-card p-5 sm:p-6 rounded-xl smooth-transition hover:scale-105 hover:glow-effect group"
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            <div className="text-primary mb-3 group-hover:scale-110 smooth-transition flex items-center justify-center sm:justify-start">
              {feature.icon}
            </div>
            <h3 className="font-semibold text-foreground mb-2 text-center sm:text-left">
              {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground text-center sm:text-left">
              {feature.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Features;