import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash2, Plus, Search, Eye, FileText, Calendar, Tag } from 'lucide-react';

// Define blog post interface
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  featured_image: string;
  author_id: string;
  category: string;
  status: 'draft' | 'published' | 'archived';
  meta_title: string;
  meta_description: string;
  created_at: string;
  updated_at: string;
  published_at?: string;
}

const AdminBlogPosts = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const { toast } = useToast();

  // Form state for adding/editing blog posts
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    content: '',
    excerpt: '',
    featured_image: '',
    category: '',
    status: 'draft',
    meta_title: '',
    meta_description: '',
  });

  useEffect(() => {
    fetchBlogPosts();
  }, []);

  const fetchBlogPosts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error: any) {
      console.error('Error fetching blog posts:', error);
      toast({
        title: 'Error',
        description: 'Failed to load blog posts',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData(prev => ({
      ...prev,
      title,
      slug: generateSlug(title)
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      featured_image: '',
      category: '',
      status: 'draft',
      meta_title: '',
      meta_description: '',
    });
  };

  const handleAddPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .insert({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          featured_image: formData.featured_image,
          category: formData.category,
          status: formData.status,
          meta_title: formData.meta_title || formData.title,
          meta_description: formData.meta_description || formData.excerpt,
          author_id: '1', // Default author ID, would be replaced with actual user ID
          published_at: formData.status === 'published' ? new Date().toISOString() : null,
        })
        .select();

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Blog post created successfully',
      });

      resetForm();
      setIsAddDialogOpen(false);
      fetchBlogPosts();
    } catch (error: any) {
      console.error('Error creating blog post:', error);
      toast({
        title: 'Error',
        description: 'Failed to create blog post',
        variant: 'destructive',
      });
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setSelectedPost(post);
    setFormData({
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      featured_image: post.featured_image,
      category: post.category,
      status: post.status,
      meta_title: post.meta_title,
      meta_description: post.meta_description,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePost = async () => {
    if (!selectedPost) return;

    try {
      const { error } = await supabase
        .from('blog_posts')
        .update({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          excerpt: formData.excerpt,
          featured_image: formData.featured_image,
          category: formData.category,
          status: formData.status,
          meta_title: formData.meta_title || formData.title,
          meta_description: formData.meta_description || formData.excerpt,
          updated_at: new Date().toISOString(),
          published_at: formData.status === 'published' && !selectedPost.published_at 
            ? new Date().toISOString() 
            : selectedPost.published_at,
        })
        .eq('id', selectedPost.id);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Blog post updated successfully',
      });

      resetForm();
      setIsEditDialogOpen(false);
      setSelectedPost(null);
      fetchBlogPosts();
    } catch (error: any) {
      console.error('Error updating blog post:', error);
      toast({
        title: 'Error',
        description: 'Failed to update blog post',
        variant: 'destructive',
      });
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;

      toast({
        title: 'Success',
        description: 'Blog post deleted successfully',
      });

      fetchBlogPosts();
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete blog post',
        variant: 'destructive',
      });
    }
  };

  const handleViewPost = (slug: string) => {
    window.open(`/blog/${slug}`, '_blank');
  };

  // Filter posts based on search term and active tab
  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === 'all') return matchesSearch;
    return matchesSearch && post.status === activeTab;
  });

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-2xl">Blog Posts</CardTitle>
          <CardDescription>Manage your blog content and SEO</CardDescription>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              type="search" 
              placeholder="Search posts..." 
              className="pl-8 w-[250px]" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Post
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Blog Post</DialogTitle>
                <DialogDescription>
                  Create a new blog post with SEO optimization
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleTitleChange}
                      placeholder="Enter post title"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="slug">Slug</Label>
                    <Input
                      id="slug"
                      name="slug"
                      value={formData.slug}
                      onChange={handleInputChange}
                      placeholder="post-url-slug"
                    />
                    <p className="text-xs text-muted-foreground">
                      URL-friendly version of the title. Auto-generated but can be edited.
                    </p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => handleSelectChange('category', value)}
                    >
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="California">California</SelectItem>
                        <SelectItem value="Texas">Texas</SelectItem>
                        <SelectItem value="IV Therapy">IV Therapy</SelectItem>
                        <SelectItem value="Hospice Care">Hospice Care</SelectItem>
                        <SelectItem value="Wellness">Wellness</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select 
                      value={formData.status} 
                      onValueChange={(value) => handleSelectChange('status', value as 'draft' | 'published' | 'archived')}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                        <SelectItem value="archived">Archived</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    placeholder="Brief summary of the post"
                    rows={3}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="Full blog post content"
                    rows={10}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="featured_image">Featured Image URL</Label>
                  <Input
                    id="featured_image"
                    name="featured_image"
                    value={formData.featured_image}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                <div className="border-t pt-4 mt-2">
                  <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="meta_title">Meta Title</Label>
                      <Input
                        id="meta_title"
                        name="meta_title"
                        value={formData.meta_title}
                        onChange={handleInputChange}
                        placeholder="SEO title (max 60 characters)"
                        maxLength={60}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.meta_title.length}/60 characters
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="meta_description">Meta Description</Label>
                      <Textarea
                        id="meta_description"
                        name="meta_description"
                        value={formData.meta_description}
                        onChange={handleInputChange}
                        placeholder="SEO description (max 160 characters)"
                        maxLength={160}
                        rows={3}
                      />
                      <p className="text-xs text-muted-foreground">
                        {formData.meta_description.length}/160 characters
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Cancel</Button>
                <Button onClick={handleAddPost}>Create Post</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full md:w-[400px] grid-cols-4">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="published">Published</TabsTrigger>
            <TabsTrigger value="draft">Drafts</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-6">
            <BlogPostsTable 
              posts={filteredPosts} 
              isLoading={isLoading} 
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onView={handleViewPost}
            />
          </TabsContent>
          
          <TabsContent value="published" className="mt-6">
            <BlogPostsTable 
              posts={filteredPosts} 
              isLoading={isLoading} 
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onView={handleViewPost}
            />
          </TabsContent>
          
          <TabsContent value="draft" className="mt-6">
            <BlogPostsTable 
              posts={filteredPosts} 
              isLoading={isLoading} 
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onView={handleViewPost}
            />
          </TabsContent>
          
          <TabsContent value="archived" className="mt-6">
            <BlogPostsTable 
              posts={filteredPosts} 
              isLoading={isLoading} 
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
              onView={handleViewPost}
            />
          </TabsContent>
        </Tabs>
      </CardContent>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Blog Post</DialogTitle>
            <DialogDescription>
              Update your blog post and SEO settings
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-title">Title</Label>
                <Input
                  id="edit-title"
                  name="title"
                  value={formData.title}
                  onChange={handleTitleChange}
                  placeholder="Enter post title"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-slug">Slug</Label>
                <Input
                  id="edit-slug"
                  name="slug"
                  value={formData.slug}
                  onChange={handleInputChange}
                  placeholder="post-url-slug"
                />
                <p className="text-xs text-muted-foreground">
                  URL-friendly version of the title.
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleSelectChange('category', value)}
                >
                  <SelectTrigger id="edit-category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="California">California</SelectItem>
                    <SelectItem value="Texas">Texas</SelectItem>
                    <SelectItem value="IV Therapy">IV Therapy</SelectItem>
                    <SelectItem value="Hospice Care">Hospice Care</SelectItem>
                    <SelectItem value="Wellness">Wellness</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-status">Status</Label>
                <Select 
                  value={formData.status} 
                  onValueChange={(value) => handleSelectChange('status', value as 'draft' | 'published' | 'archived')}
                >
                  <SelectTrigger id="edit-status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                    <SelectItem value="archived">Archived</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-excerpt">Excerpt</Label>
              <Textarea
                id="edit-excerpt"
                name="excerpt"
                value={formData.excerpt}
                onChange={handleInputChange}
                placeholder="Brief summary of the post"
                rows={3}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-content">Content</Label>
              <Textarea
                id="edit-content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Full blog post content"
                rows={10}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-featured_image">Featured Image URL</Label>
              <Input
                id="edit-featured_image"
                name="featured_image"
                value={formData.featured_image}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            
            <div className="border-t pt-4 mt-2">
              <h3 className="text-lg font-medium mb-4">SEO Settings</h3>
              <div className="grid grid-cols-1 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-meta_title">Meta Title</Label>
                  <Input
                    id="edit-meta_title"
                    name="meta_title"
                    value={formData.meta_title}
                    onChange={handleInputChange}
                    placeholder="SEO title (max 60 characters)"
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.meta_title.length}/60 characters
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="edit-meta_description">Meta Description</Label>
                  <Textarea
                    id="edit-meta_description"
                    name="meta_description"
                    value={formData.meta_description}
                    onChange={handleInputChange}
                    placeholder="SEO description (max 160 characters)"
                    maxLength={160}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {formData.meta_description.length}/160 characters
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleUpdatePost}>Update Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

// Blog Posts Table Component
interface BlogPostsTableProps {
  posts: BlogPost[];
  isLoading: boolean;
  onEdit: (post: BlogPost) => void;
  onDelete: (postId: string) => void;
  onView: (slug: string) => void;
}

const BlogPostsTable: React.FC<BlogPostsTableProps> = ({ 
  posts, 
  isLoading,
  onEdit,
  onDelete,
  onView
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-10">
        <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-medium mb-2">No blog posts found</h3>
        <p className="text-muted-foreground">
          Create your first blog post to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Title</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>
                <div className="font-medium">{post.title}</div>
                <div className="text-xs text-muted-foreground truncate max-w-[280px]">
                  {post.excerpt}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline">
                  {post.category}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge 
                  variant={
                    post.status === 'published' ? 'default' : 
                    post.status === 'draft' ? 'secondary' : 
                    'outline'
                  }
                >
                  {post.status}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1 text-sm">
                  <Calendar className="h-3 w-3 text-muted-foreground" />
                  <span>
                    {new Date(post.created_at).toLocaleDateString()}
                  </span>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onView(post.slug)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => onEdit(post)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(post.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminBlogPosts;