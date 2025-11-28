import { PlatformBadge } from './PlatformIcons';
import { Heart, Shield, Zap } from 'lucide-react';

const Footer = () => {
    const platforms: Array<'youtube' | 'instagram' | 'facebook' | 'tiktok' | 'twitter' | 'vimeo' | 'soundcloud'> = [
        'youtube',
        'instagram',
        'facebook',
        'tiktok',
        'twitter',
        'vimeo',
        'soundcloud',
    ];

    return (
        <footer className="mt-16 pt-12 pb-8 border-t border-white/10">
            <div className="container mx-auto max-w-6xl px-4">
                {/* Supported Platforms */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
                        Supported Platforms
                    </h3>
                    <div className="flex flex-wrap justify-center gap-3">
                        {platforms.map((platform) => (
                            <PlatformBadge key={platform} platform={platform} />
                        ))}
                    </div>
                </div>

                {/* Features Highlight */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full glass-card mb-3">
                            <Zap className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Lightning-fast downloads with no limits
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full glass-card mb-3">
                            <Shield className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            100% private - we don't store any data
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full glass-card mb-3">
                            <Heart className="w-6 h-6 text-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Free forever - no subscriptions needed
                        </p>
                    </div>
                </div>

                {/* Copyright & Info */}
                <div className="text-center space-y-2">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Universal Downloader. All rights reserved.
                    </p>
                    <p className="text-xs text-muted-foreground/60">
                        Download media for personal use only. Respect copyright laws and content creator rights.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
