
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  locked?: boolean;
  requiresUpgrade?: 'core' | 'vip';
  onClick?: () => void;
  className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  description,
  icon: Icon,
  locked = false,
  requiresUpgrade,
  onClick,
  className
}) => {
  const handleClick = () => {
    console.log('FeatureCard: Button clicked for:', title);
    console.log('FeatureCard: onClick function exists:', !!onClick);
    if (onClick) {
      try {
        onClick();
      } catch (error) {
        console.error('FeatureCard: Error calling onClick:', error);
      }
    } else {
      console.warn('FeatureCard: No onClick handler provided');
    }
  };
  return (
    <Card className={cn(
      'feature-card overflow-hidden',
      locked ? 'opacity-80' : '',
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="bg-primary/10 p-2 rounded-md">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          {locked && (
            <div className="bg-muted text-xs font-medium px-2 py-1 rounded-full">
              {requiresUpgrade === 'vip' ? 'VIP Only' : 'Core & VIP'}
            </div>
          )}
        </div>
        <CardTitle className="mt-4">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{description}</CardDescription>
      </CardContent>
      <CardFooter>
        {locked ? (
          <Button variant="outline" className="w-full" onClick={handleClick}>
            Upgrade to Unlock
          </Button>
        ) : (
          <Button className="w-full" onClick={handleClick}>
            Access Feature
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default FeatureCard;
