
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';

interface AIAssistantProps {
  mode?: 'chat' | 'widget';
  initialPrompt?: string;
  title?: string;
  description?: string;
  initialMessage?: string;
  isFloating?: boolean;
  onAction?: (action: string, data: any) => void;
}

const AIAssistant: React.FC<AIAssistantProps> = ({ 
  mode = 'chat',
  initialPrompt,
  title,
  description,
  initialMessage,
  isFloating = false,
  onAction
}) => {
  const { membershipTier } = useAuth();
  const [availableModels, setAvailableModels] = useState<string[]>([]);
  
  // Determine available models based on membership tier
  useEffect(() => {
    let models = ['gpt-3.5-turbo']; // Base model available to all
    
    if (membershipTier === 'core') {
      models.push('gpt-4'); // Add GPT-4 for Core tier
    }
    
    if (membershipTier === 'vip') {
      models.push('gpt-4', 'claude-3'); // Add all models for VIP tier
    }
    
    setAvailableModels(models);
  }, [membershipTier]);
  
  // Actual implementation would go here
  
  return (
    <div>
      {title && <h2>{title}</h2>}
      {description && <p className="text-sm text-muted-foreground mb-2">{description}</p>}
      <p>Available models: {availableModels.join(', ')}</p>
      {initialMessage && (
        <div className="bg-slate-50 p-4 rounded-lg mt-2 border">
          <p className="text-sm">{initialMessage}</p>
        </div>
      )}
      {/* Assistant implementation */}
    </div>
  );
};

export default AIAssistant;
