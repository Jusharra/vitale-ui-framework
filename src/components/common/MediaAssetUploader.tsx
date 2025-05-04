
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AssetType, AssetCategory, ChannelType } from '@/utils/mediaAssetManager';
import { useMediaAssets } from '@/hooks/useMediaAssets';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface MediaAssetUploaderProps {
  onAssetUploaded?: (assetUrl: string) => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
  assetCategory?: AssetCategory;
  showPreview?: boolean;
}

const MediaAssetUploader = ({
  onAssetUploaded,
  allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'],
  maxSizeMB = 5,
  assetCategory = AssetCategory.IMAGE,
  showPreview = true,
}: MediaAssetUploaderProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [assetType, setAssetType] = useState<AssetType>(AssetType.MASTER);
  const [channelType, setChannelType] = useState<ChannelType | undefined>(undefined);
  const [tags, setTags] = useState<string>('');
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const { uploadAsset } = useMediaAssets();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      
      // Check file type
      if (allowedTypes.length && !allowedTypes.includes(selectedFile.type)) {
        toast({
          title: 'Invalid file type',
          description: `Please upload one of the following types: ${allowedTypes.join(', ')}`,
          variant: 'destructive',
        });
        return;
      }
      
      // Check file size
      const maxSizeBytes = maxSizeMB * 1024 * 1024; // Convert MB to bytes
      if (selectedFile.size > maxSizeBytes) {
        toast({
          title: 'File too large',
          description: `Maximum file size is ${maxSizeMB}MB`,
          variant: 'destructive',
        });
        return;
      }
      
      setFile(selectedFile);
      
      // Generate preview for image files
      if (showPreview && selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'No file selected',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }
    
    setIsUploading(true);
    
    try {
      const result = await uploadAsset(file, {
        assetType,
        category: assetCategory,
        channelType,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        metadata: {
          uploadedFrom: 'MediaAssetUploader',
          originalSize: file.size,
          uploadedAt: new Date().toISOString(),
        }
      });
      
      if (result) {
        toast({
          title: 'Upload successful',
          description: 'The file has been uploaded successfully',
        });
        
        if (onAssetUploaded) {
          onAssetUploaded(result.url);
        }
        
        // Reset form
        setFile(null);
        setPreviewUrl(null);
      } else {
        throw new Error('Failed to upload file');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: 'There was an error uploading your file',
        variant: 'destructive',
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Upload Media Asset</CardTitle>
        <CardDescription>
          Upload and manage your media assets for different distribution channels
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-4">
          <div className="flex items-center gap-4">
            <div className="w-1/2">
              <label className="text-sm font-medium leading-none mb-2 block">
                Asset Type
              </label>
              <Select 
                value={assetType} 
                onValueChange={(value) => setAssetType(value as AssetType)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select asset type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={AssetType.SOURCE}>Source File</SelectItem>
                  <SelectItem value={AssetType.MASTER}>Master File</SelectItem>
                  <SelectItem value={AssetType.CHANNEL}>Channel File</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {assetType === AssetType.CHANNEL && (
              <div className="w-1/2">
                <label className="text-sm font-medium leading-none mb-2 block">
                  Channel
                </label>
                <Select 
                  value={channelType} 
                  onValueChange={(value) => setChannelType(value as ChannelType)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select channel" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={ChannelType.WEB}>Web</SelectItem>
                    <SelectItem value={ChannelType.MOBILE_IOS}>iOS</SelectItem>
                    <SelectItem value={ChannelType.MOBILE_ANDROID}>Android</SelectItem>
                    <SelectItem value={ChannelType.TABLET}>Tablet</SelectItem>
                    <SelectItem value={ChannelType.PRINT}>Print</SelectItem>
                    <SelectItem value={ChannelType.EMAIL}>Email</SelectItem>
                    <SelectItem value={ChannelType.SOCIAL}>Social Media</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <div>
            <label className="text-sm font-medium leading-none mb-2 block">
              Tags (comma separated)
            </label>
            <Input
              placeholder="logo, branding, homepage"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium leading-none mb-2 block">
              Upload File
            </label>
            <div className="border border-dashed rounded-lg p-4 text-center">
              <Input
                type="file"
                onChange={handleFileChange}
                accept={allowedTypes.join(',')}
                className="mb-2"
              />
              <div className="text-xs text-muted-foreground">
                Max file size: {maxSizeMB}MB
              </div>
              {file && (
                <div className="mt-2">
                  <Badge variant="outline" className="mr-1">
                    {file.name}
                  </Badge>
                  <Badge variant="secondary">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {showPreview && previewUrl && (
            <div className="border rounded-lg p-2">
              <div className="text-sm font-medium mb-2">Preview</div>
              <div className="flex justify-center">
                <img src={previewUrl} alt="Preview" className="max-h-40 object-contain" />
              </div>
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={!file || isUploading}
            className="w-full"
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="mr-2 h-4 w-4" />
                Upload Asset
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MediaAssetUploader;
