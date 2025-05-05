
import { supabase } from '@/integrations/supabase/client';
import { MediaAsset, MediaAssetPermission, AssetType } from '@/types/mediaAsset';

export class MediaAssetManager {
  private authUser: string | null;

  constructor(userId: string | null) {
    this.authUser = userId;
  }

  /**
   * Upload a file to storage and create a media asset record
   */
  async uploadAsset(
    file: File,
    title: string,
    description: string,
    category: string,
    additionalMetadata: Record<string, any> = {}
  ): Promise<MediaAsset | null> {
    try {
      if (!this.authUser) throw new Error('User not authenticated');
      
      // Generate a unique file path
      const timestamp = Date.now();
      const fileExt = file.name.split('.').pop();
      const sanitizedFileName = file.name
        .replace(/\.[^/.]+$/, "") // Remove extension
        .replace(/[^a-zA-Z0-9]/g, '_') // Replace non-alphanumeric with underscore
        .toLowerCase();
      
      const filePath = `uploads/${this.authUser}/${timestamp}_${sanitizedFileName}.${fileExt}`;
      
      // Determine asset type based on file MIME type
      const assetType = this.getAssetTypeFromMimeType(file.type);
      
      // Upload to storage (would be implemented for real storage)
      // const { data: storageData, error: storageError } = await supabase.storage
      //  .from('media')
      //  .upload(filePath, file);
      
      // if (storageError) throw storageError;
      
      // Create asset record in database
      const { data, error } = await supabase
        .from('media_assets')
        .insert({
          title,
          description,
          asset_type: assetType,
          category,
          file_path: filePath,
          original_filename: file.name,
          file_type: file.type,
          file_size: file.size,
          storage_type: 'local',
          metadata: additionalMetadata,
          profile_id: this.authUser
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data as unknown as MediaAsset;
    } catch (error) {
      console.error('Error uploading asset:', error);
      return null;
    }
  }
  
  /**
   * Get a list of media assets
   */
  async getAssets(options: {
    limit?: number,
    category?: string,
    assetType?: string,
    search?: string,
    sortBy?: string,
    sortDirection?: 'asc' | 'desc'
  } = {}): Promise<MediaAsset[]> {
    try {
      if (!this.authUser) return [];
      
      const {
        limit = 50,
        category,
        assetType,
        search,
        sortBy = 'created_at',
        sortDirection = 'desc'
      } = options;
      
      let query = supabase
        .from('media_assets')
        .select('*');
      
      // Add filters
      if (category) {
        query = query.eq('category', category);
      }
      
      if (assetType) {
        query = query.eq('asset_type', assetType);
      }
      
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%`);
      }
      
      // Add sort and limit
      query = query.order(sortBy, { ascending: sortDirection === 'asc' }).limit(limit);
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      return (data || []) as unknown as MediaAsset[];
    } catch (error) {
      console.error('Error fetching assets:', error);
      return [];
    }
  }
  
  /**
   * Get a single media asset by ID
   */
  async getAssetById(assetId: string): Promise<MediaAsset | null> {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .eq('id', assetId)
        .maybeSingle();
      
      if (error) throw error;
      
      return data as unknown as MediaAsset;
    } catch (error) {
      console.error('Error fetching asset:', error);
      return null;
    }
  }
  
  /**
   * Update a media asset
   */
  async updateAsset(assetId: string, updates: Partial<MediaAsset>): Promise<MediaAsset | null> {
    try {
      if (!this.authUser) throw new Error('User not authenticated');
      
      // Check if the user has permission to update this asset
      const { data: asset, error: assetError } = await supabase
        .from('media_assets')
        .select('*')
        .eq('id', assetId)
        .maybeSingle();
      
      if (assetError) throw assetError;
      if (!asset) throw new Error('Asset not found');
      
      // Only allow updates if user is the owner or has edit permission
      if (asset.profile_id !== this.authUser) {
        const { data: permission, error: permError } = await supabase
          .from('media_asset_permissions')
          .select('*')
          .eq('asset_id', assetId)
          .eq('shared_with', this.authUser)
          .in('permission_type', ['edit'])
          .maybeSingle();
        
        if (permError) throw permError;
        if (!permission) throw new Error('You do not have permission to update this asset');
      }
      
      // Remove fields that shouldn't be updated
      const { id, created_at, profile_id, ...validUpdates } = updates;
      
      // Perform the update
      const { data, error } = await supabase
        .from('media_assets')
        .update(validUpdates as any)
        .eq('id', assetId)
        .select()
        .single();
      
      if (error) throw error;
      
      return data as unknown as MediaAsset;
    } catch (error) {
      console.error('Error updating asset:', error);
      return null;
    }
  }
  
  /**
   * Delete a media asset
   */
  async deleteAsset(assetId: string): Promise<boolean> {
    try {
      if (!this.authUser) throw new Error('User not authenticated');
      
      // Delete the asset
      const { error } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', assetId);
      
      if (error) throw error;
      
      // In a real implementation, you would also delete the file from storage
      
      return true;
    } catch (error) {
      console.error('Error deleting asset:', error);
      return false;
    }
  }
  
  /**
   * Share an asset with another user
   */
  async shareAsset(assetId: string, userId: string, permissionType: string): Promise<boolean> {
    try {
      if (!this.authUser) throw new Error('User not authenticated');
      
      const { error } = await supabase
        .from('media_asset_permissions')
        .insert({
          asset_id: assetId,
          shared_with: userId,
          permission_type: permissionType
        });
      
      if (error) throw error;
      
      return true;
    } catch (error) {
      console.error('Error sharing asset:', error);
      return false;
    }
  }
  
  /**
   * Helper to determine asset type from MIME type
   */
  private getAssetTypeFromMimeType(mimeType: string): AssetType {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    if (mimeType.startsWith('audio/')) return 'audio';
    if (mimeType.includes('pdf') || 
        mimeType.includes('document') ||
        mimeType.includes('spreadsheet') ||
        mimeType.includes('presentation')) {
      return 'document';
    }
    return 'other';
  }
}

// Create a hook for easier access to the media asset manager
export const useMediaAssetManager = (userId: string | null) => {
  return new MediaAssetManager(userId);
};
