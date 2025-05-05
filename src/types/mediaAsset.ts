
export interface MediaAsset {
  id: string;
  title: string;
  description?: string;
  asset_type: string;
  category: string;
  file_path: string;
  original_filename: string;
  file_type: string;
  file_size?: number;
  storage_type?: string;
  metadata?: Record<string, any> | any; // Adjusted to handle both Record and Json types
  version?: number;
  is_source?: boolean;
  is_master?: boolean;
  parent_id?: string;
  profile_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface MediaAssetPermission {
  id: string;
  asset_id: string;
  shared_with: string;
  permission_type: string;
  created_at?: string;
  updated_at?: string;
}

export type AssetType = 'image' | 'video' | 'document' | 'audio' | 'other';
export type AssetCategory = 'profile' | 'health' | 'promotion' | 'vacation' | 'system' | 'other';
export type PermissionType = 'view' | 'edit' | 'delete' | 'share';
