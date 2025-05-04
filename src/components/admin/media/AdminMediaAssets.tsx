
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Loader2, UploadCloud, Search, Filter } from 'lucide-react';
import { MediaAsset } from '@/types/mediaAsset';

const AdminMediaAssets = () => {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    const fetchAssets = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('media_assets')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setAssets(data || []);
      } catch (error: any) {
        console.error('Error fetching media assets:', error);
        toast({
          title: 'Error',
          description: 'Failed to load media assets',
          variant: 'destructive',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssets();
  }, [toast]);

  const filteredAssets = assets.filter(asset => {
    if (!searchQuery) return true;
    return (
      asset.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (asset.description && asset.description.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    try {
      // In a real implementation, you would upload to storage bucket here
      // For now, we'll just create a record in the database
      const newAsset = {
        title: file.name,
        description: `Uploaded by admin on ${new Date().toLocaleDateString()}`,
        asset_type: file.type.split('/')[0],
        category: 'other',
        file_path: `/uploads/${file.name}`,
        original_filename: file.name,
        file_type: file.type,
        file_size: file.size,
        profile_id: user?.id
      };
      
      const { data, error } = await supabase
        .from('media_assets')
        .insert([newAsset])
        .select();
        
      if (error) throw error;
      
      if (data) {
        setAssets([...data, ...assets]);
        toast({
          title: 'Upload successful',
          description: `File ${file.name} has been uploaded`,
        });
      }
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: 'Upload failed',
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Media Asset Management</CardTitle>
          <div className="flex gap-2">
            <Input 
              type="file"
              id="file-upload"
              className="hidden"
              onChange={handleUpload}
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <Button variant="outline">
                <UploadCloud className="mr-2 h-4 w-4" />
                Upload
              </Button>
            </label>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search assets..."
              className="pl-8"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
        </div>
        
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All Assets</TabsTrigger>
            <TabsTrigger value="images">Images</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
          <TabsContent value="all" className="pt-4">
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filteredAssets.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No assets found
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAssets.map((asset) => (
                  <div 
                    key={asset.id} 
                    className="border rounded-md p-4 hover:bg-muted/50 transition-colors"
                  >
                    <div className="font-medium">{asset.title}</div>
                    <div className="text-sm text-muted-foreground truncate">
                      {asset.description || 'No description'}
                    </div>
                    <div className="text-xs text-muted-foreground mt-2">
                      Type: {asset.asset_type} • {new Date(asset.created_at || '').toLocaleDateString()}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </TabsContent>
          <TabsContent value="images" className="pt-4">
            <div className="text-center py-8 text-muted-foreground">
              Filter implementation for images
            </div>
          </TabsContent>
          <TabsContent value="documents" className="pt-4">
            <div className="text-center py-8 text-muted-foreground">
              Filter implementation for documents
            </div>
          </TabsContent>
          <TabsContent value="videos" className="pt-4">
            <div className="text-center py-8 text-muted-foreground">
              Filter implementation for videos
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AdminMediaAssets;
