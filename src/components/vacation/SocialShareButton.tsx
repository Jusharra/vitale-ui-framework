import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Copy, 
  Share2,
  MessageCircle
} from 'lucide-react';

interface SocialShareButtonProps {
  packageName: string;
  packageDescription: string;
  packagePrice: number;
  packageImage?: string;
  bookingUrl: string;
}

interface SocialPlatform {
  name: string;
  icon: React.ComponentType<any>;
  color: string;
  shareUrl: (data: ShareData) => string;
  isWebSupported: boolean;
}

interface ShareData {
  url: string;
  title: string;
  description: string;
  image?: string;
}

const SocialShareButton: React.FC<SocialShareButtonProps> = ({
  packageName,
  packageDescription,
  packagePrice,
  packageImage,
  bookingUrl
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copying, setCopying] = useState(false);
  const { toast } = useToast();

  const shareData: ShareData = {
    url: bookingUrl,
    title: `Check out this amazing ${packageName} vacation package!`,
    description: `${packageDescription} Starting at $${packagePrice}. Book now!`,
    image: packageImage
  };

  const platforms: SocialPlatform[] = [
    {
      name: 'Facebook',
      icon: Facebook,
      color: 'text-blue-600 hover:text-blue-700',
      isWebSupported: true,
      shareUrl: (data) => 
        `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(data.url)}&quote=${encodeURIComponent(data.title + ' - ' + data.description)}`
    },
    {
      name: 'Twitter',
      icon: Twitter,
      color: 'text-blue-400 hover:text-blue-500',
      isWebSupported: true,
      shareUrl: (data) => 
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(data.url)}&text=${encodeURIComponent(data.title + ' - ' + data.description)}`
    },
    {
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'text-blue-700 hover:text-blue-800',
      isWebSupported: true,
      shareUrl: (data) => 
        `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(data.url)}`
    },
    {
      name: 'WhatsApp',
      icon: MessageCircle,
      color: 'text-green-600 hover:text-green-700',
      isWebSupported: true,
      shareUrl: (data) => 
        `https://wa.me/?text=${encodeURIComponent(data.title + ' - ' + data.description + ' ' + data.url)}`
    },
    {
      name: 'Instagram',
      icon: Instagram,
      color: 'text-pink-600 hover:text-pink-700',
      isWebSupported: false,
      shareUrl: () => '#'
    }
  ];

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: shareData.title,
          text: shareData.description,
          url: shareData.url,
        });
        toast({
          title: "Shared successfully!",
          description: "Package shared via native sharing",
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.error('Error sharing:', error);
          toast({
            title: "Share failed",
            description: "Unable to share via native sharing",
            variant: "destructive",
          });
        }
      }
    }
  };

  const handlePlatformShare = (platform: SocialPlatform) => {
    if (platform.name === 'Instagram') {
      // Instagram doesn't support web sharing, show guidance
      toast({
        title: "Instagram Sharing",
        description: "Copy the link and share it manually on Instagram",
      });
      handleCopyLink();
      return;
    }

    if (platform.isWebSupported) {
      const url = platform.shareUrl(shareData);
      window.open(url, '_blank', 'width=600,height=400');
      
      toast({
        title: `Shared to ${platform.name}`,
        description: "Package shared successfully",
      });
    }
  };

  const handleCopyLink = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(shareData.url);
      toast({
        title: "Link copied!",
        description: "Booking link copied to clipboard",
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Copy failed",
        description: "Unable to copy link to clipboard",
        variant: "destructive",
      });
    } finally {
      setCopying(false);
    }
  };

  return (
    <div className="relative">
      <Button
        onClick={() => setIsOpen(!isOpen)}
        variant="outline"
        size="sm"
        className="flex items-center gap-2"
      >
        <Share2 className="w-4 h-4" />
        Share Package
      </Button>

      {isOpen && (
        <Card className="absolute top-full mt-2 right-0 z-50 w-64 shadow-lg">
          <CardContent className="p-4">
            <div className="space-y-3">
              <h4 className="font-medium text-sm">Share this vacation package</h4>
              
              {/* Native Share (if supported) */}
              {navigator.share && (
                <Button
                  onClick={handleNativeShare}
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share via device
                </Button>
              )}

              {/* Social Media Platforms */}
              <div className="grid grid-cols-2 gap-2">
                {platforms.map((platform) => (
                  <Button
                    key={platform.name}
                    onClick={() => handlePlatformShare(platform)}
                    variant="ghost"
                    size="sm"
                    className={`justify-start ${platform.color}`}
                  >
                    <platform.icon className="w-4 h-4 mr-2" />
                    {platform.name}
                  </Button>
                ))}
              </div>

              {/* Copy Link */}
              <Button
                onClick={handleCopyLink}
                disabled={copying}
                variant="outline"
                size="sm"
                className="w-full justify-start"
              >
                <Copy className="w-4 h-4 mr-2" />
                {copying ? 'Copying...' : 'Copy Link'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Backdrop to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default SocialShareButton;