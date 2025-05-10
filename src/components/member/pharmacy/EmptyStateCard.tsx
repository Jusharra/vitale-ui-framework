
import React, { ReactNode } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface EmptyStateCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  children?: ReactNode;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  children
}) => {
  return (
    <Card>
      <CardContent className="p-6 text-center">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          {description}
        </p>
        {actionLabel && onAction && (
          <Button variant="outline" onClick={onAction}>
            <span>{actionLabel}</span>
          </Button>
        )}
        {children}
      </CardContent>
    </Card>
  );
};

export default EmptyStateCard;
