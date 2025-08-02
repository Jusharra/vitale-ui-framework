import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface MediaUploaderProps {
  currentUrl?: string;
  onUpload: (url: string) => void;
  onRemove?: () => void;
  folder?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
}

const MediaUploader = ({
  currentUrl,
  onUpload,
  onRemove,
  folder = 'general',
  accept = 'image/*',
  maxSize = 10,
  className = ''
}: MediaUploaderProps) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file size
    if (file.size > maxSize * 1024 * 1024) {
      toast({
        title: "File too large",
        description: `File size must be less than ${maxSize}MB`,
        variant: "destructive"
      });
      return;
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file",
        variant: "destructive"
      });
      return;
    }

    await uploadFile(file);
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${folder}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      const { data, error } = await supabase.storage
        .from('site_media')
        .upload(fileName, file);

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage
        .from('site_media')
        .getPublicUrl(data.path);

      onUpload(publicUrl);
      
      toast({
        title: "Upload successful",
        description: "Image has been uploaded successfully"
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = async () => {
    if (currentUrl && onRemove) {
      try {
        // Extract file path from URL
        const urlParts = currentUrl.split('/');
        const bucketIndex = urlParts.findIndex(part => part === 'site_media');
        if (bucketIndex !== -1 && bucketIndex < urlParts.length - 1) {
          const filePath = urlParts.slice(bucketIndex + 1).join('/');
          
          await supabase.storage
            .from('site_media')
            .remove([filePath]);
        }
        
        onRemove();
        toast({
          title: "Image removed",
          description: "Image has been removed successfully"
        });
      } catch (error) {
        console.error('Remove error:', error);
        toast({
          title: "Remove failed",
          description: "Failed to remove image",
          variant: "destructive"
        });
      }
    }
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {currentUrl ? (
        <div className="relative">
          <img
            src={currentUrl}
            alt="Uploaded media"
            className="w-full h-48 object-cover rounded-lg border"
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4" />
            </Button>
            {onRemove && (
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={handleRemove}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-muted-foreground/50 transition-colors"
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <ImageIcon className="h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Click to upload an image
              </p>
              <p className="text-xs text-muted-foreground">
                Max size: {maxSize}MB
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;