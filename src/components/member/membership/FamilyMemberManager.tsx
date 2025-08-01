import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Mail, UserMinus, Crown } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/context/AuthContext';

interface FamilyMember {
  id: string;
  user_id: string;
  member_type: 'primary' | 'additional';
  status: 'active' | 'inactive' | 'pending';
  joined_at: string;
  user_email?: string;
  user_name?: string;
}

interface FamilyGroup {
  id: string;
  group_name: string;
  created_at: string;
}

const FamilyMemberManager: React.FC = () => {
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [familyGroup, setFamilyGroup] = useState<FamilyGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [isInviting, setIsInviting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchFamilyData();
    }
  }, [user]);

  const fetchFamilyData = async () => {
    if (!user) return;

    try {
      // First check if user is a primary member of a family group
      const { data: familyGroupData, error: groupError } = await supabase
        .from('family_groups')
        .select('*')
        .eq('primary_member_id', user.id)
        .maybeSingle();

      if (groupError && groupError.code !== 'PGRST116') {
        throw groupError;
      }

      setFamilyGroup(familyGroupData);

      if (familyGroupData) {
        // Fetch family members
        const { data: membersData, error: membersError } = await supabase
          .from('family_members')
          .select('*')
          .eq('family_group_id', familyGroupData.id);

        if (membersError) throw membersError;

        // Get user details for each member
        const formattedMembers: FamilyMember[] = [];
        if (membersData) {
          for (const member of membersData) {
            const { data: userData } = await supabase.auth.admin.getUserById(member.user_id);
            formattedMembers.push({
              id: member.id,
              user_id: member.user_id,
              member_type: member.member_type as 'primary' | 'additional',
              status: member.status as 'active' | 'inactive' | 'pending',
              joined_at: member.joined_at || '',
              user_email: userData.user?.email || 'Unknown',
              user_name: userData.user?.email?.split('@')[0] || 'Unknown'
            });
          }
        }

        setFamilyMembers(formattedMembers);
      }
    } catch (error) {
      console.error('Error fetching family data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load family data',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createFamilyGroup = async () => {
    if (!user) return;

    try {
      const { data: groupData, error: groupError } = await supabase
        .from('family_groups')
        .insert({
          primary_member_id: user.id,
          group_name: `${user.email?.split('@')[0]}'s Family`
        })
        .select()
        .single();

      if (groupError) throw groupError;

      // Add current user as primary member
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_group_id: groupData.id,
          user_id: user.id,
          member_type: 'primary',
          status: 'active'
        });

      if (memberError) throw memberError;

      setFamilyGroup(groupData);
      await fetchFamilyData();

      toast({
        title: 'Success',
        description: 'Family group created successfully',
      });
    } catch (error) {
      console.error('Error creating family group:', error);
      toast({
        title: 'Error',
        description: 'Failed to create family group',
        variant: 'destructive',
      });
    }
  };

  const inviteFamilyMember = async () => {
    if (!familyGroup || !inviteEmail.trim()) return;

    setIsInviting(true);
    try {
      // Check if user exists and get their ID
      const { data: userData, error: userError } = await supabase.auth.admin.listUsers();
      const existingUser = userData.users.find((u: any) => u.email === inviteEmail.trim());

      if (!existingUser) {
        toast({
          title: 'User not found',
          description: 'The email address is not registered. Please ask them to create an account first.',
          variant: 'destructive',
        });
        return;
      }

      // Add to family members
      const { error: memberError } = await supabase
        .from('family_members')
        .insert({
          family_group_id: familyGroup.id,
          user_id: existingUser.id,
          member_type: 'additional',
          status: 'pending'
        });

      if (memberError) throw memberError;

      setInviteEmail('');
      setIsInviteDialogOpen(false);
      await fetchFamilyData();

      toast({
        title: 'Invitation sent',
        description: `Family member invitation sent to ${inviteEmail}`,
      });
    } catch (error) {
      console.error('Error inviting family member:', error);
      toast({
        title: 'Error',
        description: 'Failed to invite family member',
        variant: 'destructive',
      });
    } finally {
      setIsInviting(false);
    }
  };

  const removeFamilyMember = async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('family_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;

      await fetchFamilyData();

      toast({
        title: 'Success',
        description: 'Family member removed successfully',
      });
    } catch (error) {
      console.error('Error removing family member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove family member',
        variant: 'destructive',
      });
    }
  };

  if (isLoading) {
    return <div>Loading family data...</div>;
  }

  if (!familyGroup) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Family Management
          </CardTitle>
          <CardDescription>
            Create a family group to add additional family members to your subscription
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={createFamilyGroup}>
            <Plus className="h-4 w-4 mr-2" />
            Create Family Group
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Family Management
        </CardTitle>
        <CardDescription>
          Manage your family members and their access to premium features
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{familyGroup.group_name}</h3>
            <p className="text-sm text-muted-foreground">
              {familyMembers.length} member{familyMembers.length !== 1 ? 's' : ''}
            </p>
          </div>
          
          <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Member
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Invite Family Member</DialogTitle>
                <DialogDescription>
                  Invite a family member to join your premium subscription. They'll get access to all premium features for $50/month.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="family@example.com"
                    value={inviteEmail}
                    onChange={(e) => setInviteEmail(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsInviteDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={inviteFamilyMember} disabled={isInviting || !inviteEmail.trim()}>
                  {isInviting ? 'Sending...' : 'Send Invitation'}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-2">
          {familyMembers.map((member) => (
            <div key={member.id} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  {member.member_type === 'primary' && <Crown className="h-4 w-4 text-yellow-500" />}
                  <Mail className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="font-medium">{member.user_email}</p>
                  <div className="flex items-center gap-2">
                    <Badge variant={member.member_type === 'primary' ? 'default' : 'secondary'}>
                      {member.member_type === 'primary' ? 'Primary' : 'Additional'}
                    </Badge>
                    <Badge 
                      variant={
                        member.status === 'active' ? 'default' : 
                        member.status === 'pending' ? 'secondary' : 'destructive'
                      }
                    >
                      {member.status}
                    </Badge>
                  </div>
                </div>
              </div>
              
              {member.member_type !== 'primary' && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeFamilyMember(member.id)}
                >
                  <UserMinus className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>

        <div className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
          <p className="font-medium mb-1">Billing Information</p>
          <p>Primary membership: $1,297/month</p>
          <p>Additional members: ${(familyMembers.filter(m => m.member_type === 'additional' && m.status === 'active').length * 50)}/month</p>
          <p className="font-medium">Total: ${1297 + (familyMembers.filter(m => m.member_type === 'additional' && m.status === 'active').length * 50)}/month</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FamilyMemberManager;