
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, ChevronRight, Edit, Star, X } from 'lucide-react';

interface Partner {
  id: string;
  name: string;
  email: string;
  status: string;
  rating?: number;
  profile_image?: string;
  specialties?: string[];
  accepting_new_patients?: boolean;
}

interface PartnersListProps {
  partners: Partner[];
  isLoading: boolean;
  searchTerm: string;
}

const PartnersList = ({ partners, isLoading, searchTerm }: PartnersListProps) => {
  const getInitials = (name: string) => {
    if (!name) return 'NA';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Filter partners based on search term
  const filteredPartners = searchTerm
    ? partners.filter(partner => 
        (partner.name && partner.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (partner.email && partner.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (partner.specialties && partner.specialties.some(specialty => 
          specialty.toLowerCase().includes(searchTerm.toLowerCase())
        ))
      )
    : partners;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Provider</TableHead>
            <TableHead>Specialties</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Accepting New Patients</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPartners.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                {searchTerm ? "No providers found matching your search" : "No providers found"}
              </TableCell>
            </TableRow>
          ) : (
            filteredPartners.map((partner) => (
              <TableRow key={partner.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={partner.profile_image} />
                      <AvatarFallback>{getInitials(partner.name)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{partner.name}</div>
                      <div className="text-xs text-muted-foreground">{partner.email}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {partner.specialties && partner.specialties.map((specialty, idx) => (
                      <Badge key={idx} variant="outline">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={partner.status === "active" ? "outline" : "secondary"} className={partner.status === "active" ? "border-green-500 text-green-500" : ""}>
                    {partner.status || 'Pending'}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span>{partner.rating || 'N/A'}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {partner.accepting_new_patients ? (
                    <Badge variant="outline" className="border-green-500 text-green-500">
                      <Check className="h-3 w-3 mr-1" /> Yes
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <X className="h-3 w-3 mr-1" /> No
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default PartnersList;
