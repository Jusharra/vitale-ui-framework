
import { useState, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { 
  MediaAssetManager, 
  MediaAsset,
  AssetType,
  AssetCategory,
  ChannelType,
  getMediaAssetManager
} from '@/utils/mediaAssetManager';

interface UseMediaAssetsOptions {
  assetType?: AssetType;
  category?: AssetCategory;
  channelType?: ChannelType;
  locale?: string;
  tags?: string[];
  limit?: number;
}

interface UseMediaAssetsReturn {
  assets: MediaAsset[];
  isLoading: boolean;
  error: Error | null;
  uploadAsset: (file: File, options: { 
    assetType: AssetType;
    category: AssetCategory;
    channelType?: ChannelType;
    locale?: string;
    tags?: string[];
    metadata?: Record<string, any>;
  }) => Promise<MediaAsset | null>;
  deleteAsset: (id: string) => Promise<boolean>;
  createChannelCopy: (id: string, channelType: ChannelType, options?: {
    locale?: string;
    metadata?: Record<string, any>;
  }) => Promise<MediaAsset | null>;
  createNewVersion: (id: string, file: File, metadata?: Record<string, any>) => Promise<MediaAsset | null>;
  refreshAssets: () => Promise<void>;
}

/**
 * Hook for working with media assets in components
 */
export const useMediaAssets = (options: UseMediaAssetsOptions = {}): UseMediaAssetsReturn => {
  const { user } = useAuth();
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  
  // Get the MediaAssetManager instance
  const getManager = useCallback(() => {
    return getMediaAssetManager(user?.id || null);
  }, [user?.id]);
  
  // Load assets based on options
  const loadAssets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const manager = getManager();
      const result = await manager.queryAssets({
        assetType: options.assetType,
        category: options.category,
        channelType: options.channelType,
        locale: options.locale,
        tags: options.tags,
        limit: options.limit || 50
      });
      
      setAssets(result);
    } catch (err) {
      console.error('Error loading assets:', err);
      setError(err instanceof Error ? err : new Error('Failed to load assets'));
    } finally {
      setIsLoading(false);
    }
  }, [
    options.assetType,
    options.category,
    options.channelType,
    options.locale,
    options.tags,
    options.limit,
    getManager
  ]);
  
  // Initial load
  useEffect(() => {
    loadAssets();
  }, [loadAssets]);
  
  // Upload a new asset
  const uploadAsset = useCallback(async (
    file: File,
    options: {
      assetType: AssetType;
      category: AssetCategory;
      channelType?: ChannelType;
      locale?: string;
      tags?: string[];
      metadata?: Record<string, any>;
    }
  ): Promise<MediaAsset | null> => {
    try {
      const manager = getManager();
      const result = await manager.uploadAsset({
        file,
        assetType: options.assetType,
        category: options.category,
        channelType: options.channelType,
        locale: options.locale,
        tags: options.tags,
        metadata: options.metadata,
      });
      
      // Refresh asset list if upload was successful
      if (result) {
        await loadAssets();
      }
      
      return result;
    } catch (err) {
      console.error('Error uploading asset:', err);
      setError(err instanceof Error ? err : new Error('Failed to upload asset'));
      return null;
    }
  }, [getManager, loadAssets]);
  
  // Delete an asset
  const deleteAsset = useCallback(async (id: string): Promise<boolean> => {
    try {
      const manager = getManager();
      const success = await manager.deleteAsset(id);
      
      // Refresh asset list if deletion was successful
      if (success) {
        await loadAssets();
      }
      
      return success;
    } catch (err) {
      console.error('Error deleting asset:', err);
      setError(err instanceof Error ? err : new Error('Failed to delete asset'));
      return false;
    }
  }, [getManager, loadAssets]);
  
  // Create a channel copy
  const createChannelCopy = useCallback(async (
    id: string,
    channelType: ChannelType,
    options?: {
      locale?: string;
      metadata?: Record<string, any>;
    }
  ): Promise<MediaAsset | null> => {
    try {
      const manager = getManager();
      const result = await manager.createChannelCopy(id, channelType, options);
      
      // Refresh asset list if operation was successful
      if (result) {
        await loadAssets();
      }
      
      return result;
    } catch (err) {
      console.error('Error creating channel copy:', err);
      setError(err instanceof Error ? err : new Error('Failed to create channel copy'));
      return null;
    }
  }, [getManager, loadAssets]);
  
  // Create a new version of an asset
  const createNewVersion = useCallback(async (
    id: string,
    file: File,
    metadata?: Record<string, any>
  ): Promise<MediaAsset | null> => {
    try {
      const manager = getManager();
      const result = await manager.createNewVersion(id, file, metadata);
      
      // Refresh asset list if operation was successful
      if (result) {
        await loadAssets();
      }
      
      return result;
    } catch (err) {
      console.error('Error creating new version:', err);
      setError(err instanceof Error ? err : new Error('Failed to create new version'));
      return null;
    }
  }, [getManager, loadAssets]);
  
  return {
    assets,
    isLoading,
    error,
    uploadAsset,
    deleteAsset,
    createChannelCopy,
    createNewVersion,
    refreshAssets: loadAssets
  };
};
