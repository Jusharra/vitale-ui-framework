
import { supabase } from '@/integrations/supabase/client';

/**
 * Media asset types based on their usage in the application
 */
export enum AssetType {
  SOURCE = 'source',
  MASTER = 'master',
  CHANNEL = 'channel'
}

/**
 * Media asset categories
 */
export enum AssetCategory {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other'
}

/**
 * Distribution channel types
 */
export enum ChannelType {
  WEB = 'web',
  MOBILE_IOS = 'ios',
  MOBILE_ANDROID = 'android',
  TABLET = 'tablet',
  PRINT = 'print',
  EMAIL = 'email',
  SOCIAL = 'social'
}

/**
 * Media asset interface
 */
export interface MediaAsset {
  id: string;
  filename: string;
  originalFilename: string;
  assetType: AssetType;
  category: AssetCategory;
  mimeType: string;
  size: number;
  url: string;
  path: string;
  metadata: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  channelType?: ChannelType;
  locale?: string;
  tags?: string[];
  version?: number;
}

interface UploadAssetOptions {
  file: File;
  assetType: AssetType;
  category: AssetCategory;
  metadata?: Record<string, any>;
  channelType?: ChannelType;
  locale?: string;
  tags?: string[];
  version?: number;
  path?: string;
}

interface AssetQueryOptions {
  assetType?: AssetType;
  category?: AssetCategory;
  channelType?: ChannelType;
  locale?: string;
  tags?: string[];
  createdBy?: string;
  dateStart?: Date;
  dateEnd?: Date;
  limit?: number;
  offset?: number;
}

/**
 * MediaAssetManager class for handling media asset operations
 */
export class MediaAssetManager {
  private bucketName: string;
  private authUser: string | null;

  constructor(bucketName = 'media-assets', authUser: string | null = null) {
    this.bucketName = bucketName;
    this.authUser = authUser;
  }

  /**
   * Upload a media asset to storage
   */
  async uploadAsset({
    file,
    assetType,
    category,
    metadata = {},
    channelType,
    locale,
    tags,
    version = 1,
    path
  }: UploadAssetOptions): Promise<MediaAsset | null> {
    try {
      // Generate a unique path for the asset
      const assetPath = path || this.generateAssetPath({
        assetType,
        category,
        channelType,
        locale,
        filename: file.name,
        version
      });

      // Upload the file to Supabase storage
      const { data, error } = await supabase.storage
        .from(this.bucketName)
        .upload(assetPath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading asset:', error);
        return null;
      }

      // Create the asset metadata
      const assetId = crypto.randomUUID();
      const assetData: MediaAsset = {
        id: assetId,
        filename: data.path,
        originalFilename: file.name,
        assetType,
        category,
        mimeType: file.type,
        size: file.size,
        url: this.getPublicUrl(data.path),
        path: data.path,
        metadata: {
          ...metadata,
          contentType: file.type
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: this.authUser || 'anonymous',
        channelType,
        locale,
        tags,
        version
      };

      // Save metadata to database
      await this.saveAssetMetadata(assetData);

      return assetData;
    } catch (error) {
      console.error('Error in uploadAsset:', error);
      return null;
    }
  }

  /**
   * Generate a structured path for storing assets
   */
  private generateAssetPath({
    assetType,
    category,
    channelType,
    locale,
    filename,
    version
  }: {
    assetType: AssetType;
    category: AssetCategory;
    channelType?: ChannelType;
    locale?: string;
    filename: string;
    version: number;
  }): string {
    // Create a path structure: assetType/category/[channelType]/[locale]/filename-v{version}
    let path = `${assetType}/${category}`;
    
    if (channelType) {
      path += `/${channelType}`;
    }
    
    if (locale) {
      path += `/${locale}`;
    }
    
    // Add version suffix to filename
    const filenameParts = filename.split('.');
    const extension = filenameParts.pop();
    const name = filenameParts.join('.');
    const versionedName = `${name}-v${version}.${extension}`;
    
    return `${path}/${versionedName}`;
  }

  /**
   * Save asset metadata to the database
   */
  private async saveAssetMetadata(asset: MediaAsset): Promise<void> {
    try {
      const { error } = await supabase
        .from('media_assets')
        .insert({
          id: asset.id,
          filename: asset.filename,
          original_filename: asset.originalFilename,
          asset_type: asset.assetType,
          category: asset.category,
          mime_type: asset.mimeType,
          size: asset.size,
          url: asset.url,
          path: asset.path,
          metadata: asset.metadata,
          created_at: asset.createdAt,
          updated_at: asset.updatedAt,
          created_by: asset.createdBy,
          channel_type: asset.channelType,
          locale: asset.locale,
          tags: asset.tags,
          version: asset.version
        });

      if (error) {
        console.error('Error saving asset metadata:', error);
      }
    } catch (error) {
      console.error('Error in saveAssetMetadata:', error);
    }
  }

  /**
   * Get public URL for an asset
   */
  getPublicUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.bucketName)
      .getPublicUrl(path);
    
    return data.publicUrl;
  }

  /**
   * Get a media asset by ID
   */
  async getAssetById(id: string): Promise<MediaAsset | null> {
    try {
      const { data, error } = await supabase
        .from('media_assets')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error('Error fetching asset:', error);
        return null;
      }

      return this.mapDatabaseAssetToMediaAsset(data);
    } catch (error) {
      console.error('Error in getAssetById:', error);
      return null;
    }
  }

  /**
   * Query media assets based on filters
   */
  async queryAssets(options: AssetQueryOptions = {}): Promise<MediaAsset[]> {
    try {
      let query = supabase
        .from('media_assets')
        .select('*');

      // Apply filters
      if (options.assetType) {
        query = query.eq('asset_type', options.assetType);
      }
      
      if (options.category) {
        query = query.eq('category', options.category);
      }
      
      if (options.channelType) {
        query = query.eq('channel_type', options.channelType);
      }
      
      if (options.locale) {
        query = query.eq('locale', options.locale);
      }
      
      if (options.tags && options.tags.length > 0) {
        // Filter for assets that contain any of the provided tags
        query = query.overlaps('tags', options.tags);
      }
      
      if (options.createdBy) {
        query = query.eq('created_by', options.createdBy);
      }
      
      if (options.dateStart) {
        query = query.gte('created_at', options.dateStart.toISOString());
      }
      
      if (options.dateEnd) {
        query = query.lte('created_at', options.dateEnd.toISOString());
      }
      
      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error querying assets:', error);
        return [];
      }

      return data.map(this.mapDatabaseAssetToMediaAsset);
    } catch (error) {
      console.error('Error in queryAssets:', error);
      return [];
    }
  }

  /**
   * Map database asset to MediaAsset interface
   */
  private mapDatabaseAssetToMediaAsset(dbAsset: any): MediaAsset {
    return {
      id: dbAsset.id,
      filename: dbAsset.filename,
      originalFilename: dbAsset.original_filename,
      assetType: dbAsset.asset_type,
      category: dbAsset.category,
      mimeType: dbAsset.mime_type,
      size: dbAsset.size,
      url: dbAsset.url,
      path: dbAsset.path,
      metadata: dbAsset.metadata || {},
      createdAt: new Date(dbAsset.created_at),
      updatedAt: new Date(dbAsset.updated_at),
      createdBy: dbAsset.created_by,
      channelType: dbAsset.channel_type,
      locale: dbAsset.locale,
      tags: dbAsset.tags,
      version: dbAsset.version
    };
  }

  /**
   * Delete an asset
   */
  async deleteAsset(id: string): Promise<boolean> {
    try {
      // First get the asset to know its path
      const asset = await this.getAssetById(id);
      if (!asset) {
        return false;
      }

      // Delete from storage
      const { error: storageError } = await supabase.storage
        .from(this.bucketName)
        .remove([asset.path]);

      if (storageError) {
        console.error('Error removing asset from storage:', storageError);
        return false;
      }

      // Delete metadata from database
      const { error: dbError } = await supabase
        .from('media_assets')
        .delete()
        .eq('id', id);

      if (dbError) {
        console.error('Error removing asset metadata:', dbError);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteAsset:', error);
      return false;
    }
  }

  /**
   * Create a copy of an asset for another channel
   */
  async createChannelCopy(
    assetId: string,
    channelType: ChannelType,
    options: { 
      locale?: string;
      metadata?: Record<string, any>;
      version?: number;
    } = {}
  ): Promise<MediaAsset | null> {
    try {
      const sourceAsset = await this.getAssetById(assetId);
      if (!sourceAsset) {
        return null;
      }

      // Download the source asset
      const { data: fileData, error: downloadError } = await supabase.storage
        .from(this.bucketName)
        .download(sourceAsset.path);

      if (downloadError || !fileData) {
        console.error('Error downloading source asset:', downloadError);
        return null;
      }

      // Create a new File object from the downloaded blob
      const file = new File([fileData], sourceAsset.originalFilename, {
        type: sourceAsset.mimeType
      });

      // Upload as a new channel asset
      const newAsset = await this.uploadAsset({
        file,
        assetType: AssetType.CHANNEL,
        category: sourceAsset.category,
        channelType,
        locale: options.locale || sourceAsset.locale,
        metadata: {
          ...sourceAsset.metadata,
          ...options.metadata,
          sourceAssetId: assetId
        },
        tags: sourceAsset.tags,
        version: options.version || sourceAsset.version
      });

      return newAsset;
    } catch (error) {
      console.error('Error in createChannelCopy:', error);
      return null;
    }
  }

  /**
   * Version an existing asset (create a new version)
   */
  async createNewVersion(
    assetId: string,
    file: File,
    metadata: Record<string, any> = {}
  ): Promise<MediaAsset | null> {
    try {
      const existingAsset = await this.getAssetById(assetId);
      if (!existingAsset) {
        return null;
      }

      const newVersion = (existingAsset.version || 1) + 1;

      // Upload new version
      return this.uploadAsset({
        file,
        assetType: existingAsset.assetType,
        category: existingAsset.category,
        channelType: existingAsset.channelType,
        locale: existingAsset.locale,
        metadata: {
          ...existingAsset.metadata,
          ...metadata,
          previousVersion: existingAsset.version,
          previousAssetId: assetId
        },
        tags: existingAsset.tags,
        version: newVersion
      });
    } catch (error) {
      console.error('Error in createNewVersion:', error);
      return null;
    }
  }
}

// Export a singleton instance for easy access across the app
let mediaAssetManager: MediaAssetManager | null = null;

export const getMediaAssetManager = (userId: string | null = null): MediaAssetManager => {
  if (!mediaAssetManager) {
    mediaAssetManager = new MediaAssetManager('media-assets', userId);
  }

  // Update user if provided
  if (userId && mediaAssetManager.authUser !== userId) {
    mediaAssetManager = new MediaAssetManager('media-assets', userId);
  }

  return mediaAssetManager;
};
