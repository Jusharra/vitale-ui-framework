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
import { Edit, Trash2, MapPin, DollarSign, Users } from 'lucide-react';
import { Facility } from './useCareTeamsData';

interface FacilitiesListProps {
  facilities: Facility[];
  isLoading: boolean;
  searchTerm: string;
}

const FacilitiesList = ({ facilities, isLoading, searchTerm }: FacilitiesListProps) => {
  // Filter facilities based on search term
  const filteredFacilities = searchTerm
    ? facilities.filter(facility => 
        (facility.name && facility.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (facility.description && facility.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (facility.location && facility.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (facility.care_type && facility.care_type.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : facilities;

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
            <TableHead className="w-[250px]">Facility</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Care Type</TableHead>
            <TableHead>Price Range</TableHead>
            <TableHead className="text-center">Availability</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredFacilities.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                {searchTerm ? "No facilities found matching your search" : "No facilities found"}
              </TableCell>
            </TableRow>
          ) : (
            filteredFacilities.map((facility) => (
              <TableRow key={facility.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{facility.name}</div>
                    <div className="text-xs text-muted-foreground max-w-[200px] truncate">{facility.description}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{facility.location}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{facility.care_type}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>{facility.price_range}</span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex flex-col items-center">
                    <Badge variant={facility.spots_available > 0 ? "outline" : "secondary"} className={facility.spots_available > 0 ? "border-green-500 text-green-500" : ""}>
                      {facility.spots_available > 0 ? `${facility.spots_available} spots` : "Full"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                      <Trash2 className="w-4 h-4" />
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

export default FacilitiesList;