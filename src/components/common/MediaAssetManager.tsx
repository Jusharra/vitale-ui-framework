
import React, { useState } from 'react';
import { 
  AssetType, 
  AssetCategory, 
  ChannelType, 
  MediaAsset 
} from '@/utils/mediaAssetManager';
import { useMediaAssets } from '@/hooks/useMediaAssets';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Image, Music, Video, File, Trash2, Copy, RefreshCw } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import MediaAssetUploader from './MediaAssetUploader';

const MediaAssetManager = () => {
  const { toast } = useToast();
  const [assetType, setAssetType] = useState<AssetType | undefined>(undefined);
  const [category, setCategory] = useState<AssetCategory | undefined>(undefined);
  const [channelType, setChannelType] = useState<ChannelType | undefined>(undefined);
  const [searchTags, setSearchTags] = useState<string>('');
  const [selectedAsset, setSelectedAsset] = useState<MediaAsset | null>(null);

  const { 
    assets, 
    isLoading, 
    error,
    deleteAsset,
    createChannelCopy,
    refreshAssets
  } = useMediaAssets({
    assetType,
    category,
    channelType,
    tags: searchTags ? searchTags.split(',').map(tag => tag.trim()) : undefined,
    limit: 50
  });

  const handleDeleteAsset = async (asset: MediaAsset) => {
    if (window.confirm(`Are you sure you want to delete "${asset.originalFilename}"?`)) {
      const success = await deleteAsset(asset.id);
      if (success) {
        toast({
          title: 'Asset Deleted',
          description: 'The media asset has been successfully deleted',
        });
        if (selectedAsset?.id === asset.id) {
          setSelectedAsset(null);
        }
      } else {
        toast({
          title: 'Deletion Failed',
          description: 'There was an error deleting the asset',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCreateChannelCopy = async (asset: MediaAsset, targetChannel: ChannelType) => {
    const result = await createChannelCopy(asset.id, targetChannel);
    if (result) {
      toast({
        title: 'Channel Copy Created',
        description: `Created a new ${targetChannel} channel version`,
      });
    } else {
      toast({
        title: 'Channel Copy Failed',
        description: 'There was an error creating the channel copy',
        variant: 'destructive',
      });
    }
  };

  const getAssetIcon = (asset: MediaAsset) => {
    if (asset.category === AssetCategory.IMAGE) return <Image className="h-6 w-6" />;
    if (asset.category === AssetCategory.VIDEO) return <Video className="h-6 w-6" />;
    if (asset.category === AssetCategory.AUDIO) return <Music className="h-6 w-6" />;
    if (asset.category === AssetCategory.DOCUMENT) return <FileText className="h-6 w-6" />;
    return <File className="h-6 w-6" />;
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
  };

  const formatDate = (date: Date): string => {
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <Tabs defaultValue="browser" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="browser">Asset Browser</TabsTrigger>
        <TabsTrigger value="upload">Upload Assets</TabsTrigger>
      </TabsList>

      <TabsContent value="browser">
        <Card>
          <CardHeader>
            <CardTitle>Media Asset Browser</CardTitle>
            <CardDescription>
              Browse, filter, and manage your media assets across all channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {/* Filter Controls */}
              <div className="flex flex-wrap gap-2">
                <div className="w-full md:w-auto md:flex-1">
                  <Select 
                    value={assetType} 
                    onValueChange={(value) => setAssetType(value as AssetType || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Asset Types" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Asset Types</SelectItem>
                      <SelectItem value={AssetType.SOURCE}>Source Files</SelectItem>
                      <SelectItem value={AssetType.MASTER}>Master Files</SelectItem>
                      <SelectItem value={AssetType.CHANNEL}>Channel Files</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="w-full md:w-auto md:flex-1">
                  <Select 
                    value={category} 
                    onValueChange={(value) => setCategory(value as AssetCategory || undefined)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      <SelectItem value={AssetCategory.IMAGE}>Images</SelectItem>
                      <SelectItem value={AssetCategory.VIDEO}>Videos</SelectItem>
                      <SelectItem value={AssetCategory.AUDIO}>Audio</SelectItem>
                      <SelectItem value={AssetCategory.DOCUMENT}>Documents</SelectItem>
                      <SelectItem value={AssetCategory.OTHER}>Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {(assetType === AssetType.CHANNEL || !assetType) && (
                  <div className="w-full md:w-auto md:flex-1">
                    <Select 
                      value={channelType} 
                      onValueChange={(value) => setChannelType(value as ChannelType || undefined)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="All Channels" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">All Channels</SelectItem>
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
              
              <Input
                placeholder="Search by tags (comma separated)"
                value={searchTags}
                onChange={(e) => setSearchTags(e.target.value)}
              />
              
              <Button onClick={refreshAssets} variant="outline" size="sm" className="w-full sm:w-auto">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh Assets
              </Button>
              
              {/* Asset List and Details */}
              <div className="grid md:grid-cols-5 gap-4 mt-4">
                {/* Asset List */}
                <div className="md:col-span-2 border rounded-lg">
                  <ScrollArea className="h-[500px] w-full p-2">
                    {isLoading ? (
                      <div className="space-y-2 p-2">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <div key={i} className="flex items-center space-x-2 p-2">
                            <Skeleton className="h-12 w-12 rounded" />
                            <div className="space-y-2">
                              <Skeleton className="h-4 w-[200px]" />
                              <Skeleton className="h-4 w-[150px]" />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : error ? (
                      <div className="p-4 text-center text-red-500">
                        Error loading assets. Please try again.
                      </div>
                    ) : assets.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        No assets found. Try different filters or upload new assets.
                      </div>
                    ) : (
                      <div className="space-y-1">
                        {assets.map((asset) => (
                          <div 
                            key={asset.id}
                            className={`flex items-center p-2 rounded cursor-pointer hover:bg-muted ${
                              selectedAsset?.id === asset.id ? 'bg-muted' : ''
                            }`}
                            onClick={() => setSelectedAsset(asset)}
                          >
                            <div className="mr-3 text-muted-foreground">
                              {getAssetIcon(asset)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="truncate font-medium text-sm">
                                {asset.originalFilename}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {formatDate(asset.createdAt)} • {formatFileSize(asset.size)}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
                
                {/* Asset Details */}
                <div className="md:col-span-3 border rounded-lg p-4">
                  {selectedAsset ? (
                    <div className="space-y-4">
                      <div className="flex justify-between items-start">
                        <h3 className="text-lg font-semibold truncate">
                          {selectedAsset.originalFilename}
                        </h3>
                        
                        <Button 
                          variant="destructive" 
                          size="sm"
                          onClick={() => handleDeleteAsset(selectedAsset)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                      
                      {/* Preview if it's an image */}
                      {selectedAsset.category === AssetCategory.IMAGE && (
                        <div className="border rounded-lg p-2 flex justify-center">
                          <img 
                            src={selectedAsset.url} 
                            alt={selectedAsset.originalFilename} 
                            className="max-h-64 object-contain"
                          />
                        </div>
                      )}
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <span className="text-sm font-medium">Type:</span>
                          <Badge variant="outline" className="ml-2">
                            {selectedAsset.assetType}
                          </Badge>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium">Category:</span>
                          <Badge variant="outline" className="ml-2">
                            {selectedAsset.category}
                          </Badge>
                        </div>
                        
                        {selectedAsset.channelType && (
                          <div>
                            <span className="text-sm font-medium">Channel:</span>
                            <Badge variant="outline" className="ml-2">
                              {selectedAsset.channelType}
                            </Badge>
                          </div>
                        )}
                        
                        {selectedAsset.version && (
                          <div>
                            <span className="text-sm font-medium">Version:</span>
                            <Badge variant="outline" className="ml-2">
                              v{selectedAsset.version}
                            </Badge>
                          </div>
                        )}
                        
                        <div>
                          <span className="text-sm font-medium">Size:</span>
                          <span className="ml-2">
                            {formatFileSize(selectedAsset.size)}
                          </span>
                        </div>
                        
                        <div>
                          <span className="text-sm font-medium">Created:</span>
                          <span className="ml-2">
                            {formatDate(selectedAsset.createdAt)}
                          </span>
                        </div>
                      </div>
                      
                      {selectedAsset.tags && selectedAsset.tags.length > 0 && (
                        <div>
                          <span className="text-sm font-medium block mb-1">Tags:</span>
                          <div className="flex flex-wrap gap-1">
                            {selectedAsset.tags.map((tag, i) => (
                              <Badge key={i} variant="secondary">{tag}</Badge>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <span className="text-sm font-medium block mb-1">Asset URL:</span>
                        <Input value={selectedAsset.url} readOnly onClick={(e) => e.currentTarget.select()} />
                      </div>
                      
                      {/* Channel Copy Creation */}
                      {(selectedAsset.assetType === AssetType.SOURCE || selectedAsset.assetType === AssetType.MASTER) && (
                        <div>
                          <div className="text-sm font-medium mb-2">Create Channel Copy:</div>
                          <div className="flex flex-wrap gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleCreateChannelCopy(selectedAsset, ChannelType.WEB)}
                            >
                              <Copy className="h-4 w-4 mr-1" /> Web
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleCreateChannelCopy(selectedAsset, ChannelType.MOBILE_IOS)}
                            >
                              <Copy className="h-4 w-4 mr-1" /> iOS
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleCreateChannelCopy(selectedAsset, ChannelType.MOBILE_ANDROID)}
                            >
                              <Copy className="h-4 w-4 mr-1" /> Android
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleCreateChannelCopy(selectedAsset, ChannelType.SOCIAL)}
                            >
                              <Copy className="h-4 w-4 mr-1" /> Social
                            </Button>
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <Button 
                          variant="secondary" 
                          className="w-full"
                          onClick={() => window.open(selectedAsset.url, '_blank')}
                        >
                          Open Asset
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                      <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">No Asset Selected</h3>
                      <p className="text-sm text-muted-foreground mt-2">
                        Select an asset from the list to view its details and manage it.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="upload">
        <div className="grid md:grid-cols-2 gap-6">
          <MediaAssetUploader 
            assetCategory={AssetCategory.IMAGE}
            allowedTypes={['image/jpeg', 'image/png', 'image/webp', 'image/gif']}
            maxSizeMB={5}
          />
          
          <MediaAssetUploader 
            assetCategory={AssetCategory.DOCUMENT}
            allowedTypes={['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']}
            showPreview={false}
            maxSizeMB={10}
          />
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default MediaAssetManager;
