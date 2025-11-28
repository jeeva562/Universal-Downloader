import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { Download, Link, Video, Music, Image, CheckCircle, Clipboard } from 'lucide-react';
import { PlatformIcon } from './PlatformIcons';

interface DownloadFormProps { }

const DownloadForm: React.FC<DownloadFormProps> = () => {
  const [url, setUrl] = useState('');
  const [format, setFormat] = useState('video');
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [mediaType, setMediaType] = useState<'video' | 'audio' | 'image' | null>(null);
  const [detectedPlatform, setDetectedPlatform] = useState<'youtube' | 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'vimeo' | 'soundcloud' | null>(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [clipboardSupported, setClipboardSupported] = useState(false);
  const { toast } = useToast();

  // Check clipboard support on mount
  useState(() => {
    setClipboardSupported(!!navigator.clipboard);
  });

  const isValidHttpUrl = (value: string) => {
    try {
      const u = new URL(value);
      return u.protocol === 'http:' || u.protocol === 'https:';
    } catch {
      return false;
    }
  };

  const detectPlatform = (url: string): typeof detectedPlatform => {
    const lowercaseUrl = url.toLowerCase();

    if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be')) {
      return 'youtube';
    }
    if (lowercaseUrl.includes('instagram.com')) {
      return 'instagram';
    }
    if (lowercaseUrl.includes('facebook.com')) {
      return 'facebook';
    }
    if (lowercaseUrl.includes('tiktok.com')) {
      return 'tiktok';
    }
    if (lowercaseUrl.includes('twitter.com') || lowercaseUrl.includes('x.com')) {
      return 'twitter';
    }
    if (lowercaseUrl.includes('vimeo.com')) {
      return 'vimeo';
    }
    if (lowercaseUrl.includes('soundcloud.com')) {
      return 'soundcloud';
    }

    return null;
  };

  const detectMediaType = (url: string): 'video' | 'audio' | 'image' | null => {
    const lowercaseUrl = url.toLowerCase();

    // ONLY direct image file URLs - most reliable
    if (lowercaseUrl.match(/\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i)) {
      return 'image';
    }

    // Audio platforms/formats
    if (lowercaseUrl.includes('soundcloud.com') ||
      lowercaseUrl.includes('spotify.com') ||
      lowercaseUrl.match(/\.(mp3|wav|flac|m4a|aac|ogg)(\?|$)/i)) {
      return 'audio';
    }

    // All social media defaults to video
    if (lowercaseUrl.includes('youtube.com') ||
      lowercaseUrl.includes('youtu.be') ||
      lowercaseUrl.includes('vimeo.com') ||
      lowercaseUrl.includes('tiktok.com') ||
      lowercaseUrl.includes('instagram.com') ||
      lowercaseUrl.includes('twitter.com') ||
      lowercaseUrl.includes('x.com') ||
      lowercaseUrl.includes('facebook.com') ||
      lowercaseUrl.match(/\.(mp4|webm|avi|mov|mkv|flv)(\?|$)/i)) {
      return 'video';
    }

    return 'video';
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setDownloadSuccess(false);

    if (value) {
      const detectedType = detectMediaType(value);
      const platform = detectPlatform(value);
      setMediaType(detectedType);
      setDetectedPlatform(platform);

      // Set default format based on media type
      if (detectedType === 'video') {
        setFormat('video');
      } else if (detectedType === 'audio') {
        setFormat('audio');
      } else if (detectedType === 'image') {
        setFormat('image');
      }
    } else {
      setMediaType(null);
      setDetectedPlatform(null);
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        handleUrlChange(text);
        toast({
          title: "Pasted!",
          description: "URL has been pasted from clipboard",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Paste Failed",
        description: "Unable to read from clipboard. Please paste manually.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const streamToBlobWithProgress = async (response: Response, onProgress: (pct: number) => void) => {
    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : undefined;
    const reader = response.body?.getReader();
    const chunks: BlobPart[] = [];
    let received = 0;

    if (!reader) {
      const blob = await response.blob();
      onProgress(100);
      return blob;
    }

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      if (value) {
        chunks.push(value);
        received += value.length;
        if (total) {
          onProgress(Math.min(99, (received / total) * 100));
        } else {
          // Estimate progress if no content-length
          onProgress(Math.min(90, (received / (1024 * 1024 * 10)) * 100)); // Rough estimate
        }
      }
    }
    const blob = new Blob(chunks);
    onProgress(100);
    return blob;
  };

  const triggerBrowserDownload = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleDownload = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url || !isValidHttpUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid http(s) URL",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    setIsLoading(true);
    setProgress(0);
    setDownloadSuccess(false);

    try {
      // Determine format parameter
      let formatParam = format;
      if (format === '720p') formatParam = 'quality:720p';
      if (format === '480p') formatParam = 'quality:480p';
      if (format === '360p') formatParam = 'quality:360p';

      const params = new URLSearchParams({
        url,
        format: formatParam
      });

      const response = await fetch(`/api/download?${params.toString()}`, {
        method: "GET",
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({ error: `Request failed (${response.status})` }));
        throw new Error(err.error || err.details || `Request failed (${response.status})`);
      }

      // Get filename from Content-Disposition header
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'download';
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="?([^"]+)"?/);
        if (match) filename = match[1];
      }

      const blob = await streamToBlobWithProgress(response, (pct) => setProgress(pct));
      triggerBrowserDownload(blob, filename);

      setDownloadSuccess(true);

      toast({
        title: "Download Complete!",
        description: `Your ${mediaType ?? 'media'} has been downloaded successfully.`,
        duration: 3000,
      });

      setTimeout(() => {
        setProgress(0);
        setUrl('');
        setMediaType(null);
        setDetectedPlatform(null);
        setIsLoading(false);
        setDownloadSuccess(false);
      }, 2000);
    } catch (error: any) {
      console.error('Download error:', error);

      let errorMessage = "Unable to download the media. ";
      if (error?.message?.includes('404')) {
        errorMessage += "The content was not found. It may be private or deleted.";
      } else if (error?.message?.includes('403')) {
        errorMessage += "Access denied. The content may be restricted.";
      } else if (error?.message?.includes('timeout')) {
        errorMessage += "Download timed out. Please try again.";
      } else {
        errorMessage += "Please check the URL and try again.";
      }

      toast({
        title: "Download Failed",
        description: errorMessage,
        variant: "destructive",
        duration: 5000,
      });
      setIsLoading(false);
      setProgress(0);
      setDownloadSuccess(false);
    }
  };

  const getFormatOptions = () => {
    switch (mediaType) {
      case 'video':
        return [
          { value: 'video', label: 'Best Quality (with audio)' },
          { value: '720p', label: '720p (with audio)' },
          { value: '480p', label: '480p (with audio)' },
          { value: '360p', label: '360p (with audio)' },
          { value: 'audio', label: 'Audio Only' },
          { value: 'image', label: 'Image/Thumbnail (if available)' },
        ];
      case 'audio':
        return [
          { value: 'audio', label: 'Best Audio Quality' },
        ];
      case 'image':
        return [
          { value: 'image', label: 'Original Quality (up to 4K)' },
          { value: 'video', label: 'Video (if this is actually a video)' },
        ];
      default:
        return [
          { value: 'video', label: 'Best Quality (with audio)' },
          { value: 'audio', label: 'Audio Only' },
          { value: 'image', label: 'Image (if available)' },
        ];
    }
  };

  const getMediaIcon = () => {
    switch (mediaType) {
      case 'video':
        return <Video className="w-5 h-5 text-primary" />;
      case 'audio':
        return <Music className="w-5 h-5 text-primary" />;
      case 'image':
        return <Image className="w-5 h-5 text-primary" />;
      default:
        return <Link className="w-5 h-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 sm:px-6">
      <form onSubmit={handleDownload} className="space-y-5 sm:space-y-6">
        {/* URL Input */}
        <div className="space-y-2">
          <label htmlFor="url" className="text-sm font-medium text-foreground flex items-center gap-2 flex-wrap">
            {getMediaIcon()}
            <span>Media URL</span>
            {mediaType && (
              <span className="text-xs bg-primary/20 px-2 py-1 rounded-full text-primary capitalize">
                {mediaType}
              </span>
            )}
            {detectedPlatform && (
              <span className="flex items-center gap-1.5 text-xs glass-card px-2 py-1 rounded-full">
                <PlatformIcon platform={detectedPlatform} size={14} className={`platform-${detectedPlatform}`} />
                <span className="capitalize">{detectedPlatform}</span>
              </span>
            )}
          </label>
          <div className="relative">
            <Input
              id="url"
              type="url"
              value={url}
              onChange={(e) => handleUrlChange(e.target.value)}
              className="glass-card text-foreground placeholder:text-muted-foreground border-0 text-base h-12 sm:h-14 pr-24 sm:pr-28 smooth-transition focus:glow-effect"
              placeholder="Paste video, audio, or image URL here..."
              disabled={isLoading}
            />
            {clipboardSupported && !url && (
              <Button
                type="button"
                onClick={handlePaste}
                size="sm"
                variant="ghost"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 sm:h-9 px-3 smooth-transition hover:scale-105"
              >
                <Clipboard className="w-4 h-4 mr-1.5" />
                <span className="hidden sm:inline">Paste</span>
              </Button>
            )}
            {url && !clipboardSupported && (
              <Link className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            )}
          </div>
        </div>

        {/* Format Selection */}
        {mediaType && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">
              Output Format
            </label>
            <Select value={format} onValueChange={setFormat} disabled={isLoading}>
              <SelectTrigger className="glass-card border-0 h-11 sm:h-12 smooth-transition focus:glow-effect">
                <SelectValue placeholder="Choose format" />
              </SelectTrigger>
              <SelectContent className="glass-card border-0">
                {getFormatOptions().map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Progress Bar */}
        {isLoading && (
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-foreground font-medium">Downloading...</span>
              <span className="text-primary font-semibold">{Math.round(progress)}%</span>
            </div>
            <Progress
              value={progress}
              className="h-2.5 glass-card"
            />
            <div className="flex items-center justify-center">
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    className="text-muted"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - progress / 100)}`}
                    className="text-primary smooth-transition"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Download className="w-6 h-6 text-primary animate-pulse" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Success State */}
        {downloadSuccess && !isLoading && (
          <div className="glass-card p-4 rounded-xl flex items-center gap-3 animate-success">
            <CheckCircle className="w-6 h-6 text-green-500" />
            <span className="text-foreground font-medium">Download complete!</span>
          </div>
        )}

        {/* Download Button */}
        <Button
          type="submit"
          disabled={!url || isLoading}
          variant="gradient"
          size="lg"
          className="w-full h-12 sm:h-14 text-base sm:text-lg font-semibold"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-5 h-5 mr-2" />
              Download {mediaType ? mediaType.charAt(0).toUpperCase() + mediaType.slice(1) : 'Media'}
            </>
          )}
        </Button>
      </form>

      {/* Supported Platforms */}
      <div className="mt-8 glass-card p-4 sm:p-5 rounded-xl">
        <h3 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-primary" />
          Supported Platforms & Formats
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <PlatformIcon platform="youtube" size={14} className="platform-youtube" />
            YouTube
          </span>
          <span className="flex items-center gap-1.5">
            <PlatformIcon platform="tiktok" size={14} className="platform-tiktok" />
            TikTok
          </span>
          <span className="flex items-center gap-1.5">
            <PlatformIcon platform="instagram" size={14} className="platform-instagram" />
            Instagram
          </span>
          <span className="flex items-center gap-1.5">
            <PlatformIcon platform="twitter" size={14} className="platform-twitter" />
            Twitter/X
          </span>
          <span className="flex items-center gap-1.5">
            <PlatformIcon platform="facebook" size={14} className="platform-facebook" />
            Facebook
          </span>
          <span className="flex items-center gap-1.5">
            <PlatformIcon platform="vimeo" size={14} className="platform-vimeo" />
            Vimeo
          </span>
          <span className="flex items-center gap-1.5">
            <PlatformIcon platform="soundcloud" size={14} className="platform-soundcloud" />
            SoundCloud
          </span>
          <span>Direct Links</span>
          <span>And more...</span>
        </div>
      </div>
    </div>
  );
};

export default DownloadForm;
