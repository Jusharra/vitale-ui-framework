import React from 'react';
import Layout from '@/components/layout/Layout';
import AdminBlogPosts from '@/components/admin/AdminBlogPosts';

const AdminBlogPostsPage = () => {
  return (
    <Layout role="admin">
      <AdminBlogPosts />
    </Layout>
  );
};

export default AdminBlogPostsPage;