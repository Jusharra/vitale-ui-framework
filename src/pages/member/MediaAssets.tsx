
import React from 'react';
import MemberPageLayout from '@/components/layout/MemberPageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MediaAssetManager from '@/components/common/MediaAssetManager';

const MediaAssetsPage = () => {
  return (
    <MemberPageLayout
      title="Media Assets"
      description="Manage your digital media assets across all platforms and channels"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Media Asset Management</CardTitle>
            <CardDescription>
              Central hub for organizing and distributing your digital content across multiple channels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MediaAssetManager />
          </CardContent>
        </Card>
      </div>
    </MemberPageLayout>
  );
};

export default MediaAssetsPage;
