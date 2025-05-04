
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
import { Check, Edit, Trash2, X } from 'lucide-react';

interface Pharmacy {
  id: string;
  name: string;
  address?: string;
  phone?: string;
  services?: string;
  status?: string;
  delivery_available?: boolean;
}

interface PharmaciesListProps {
  pharmacies: Pharmacy[];
  isLoading: boolean;
  searchTerm: string;
}

const PharmaciesList = ({ pharmacies, isLoading, searchTerm }: PharmaciesListProps) => {
  // Filter pharmacies based on search term
  const filteredPharmacies = searchTerm
    ? pharmacies.filter(pharmacy => 
        (pharmacy.name && pharmacy.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pharmacy.services && pharmacy.services.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (pharmacy.address && pharmacy.address.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    : pharmacies;

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
            <TableHead className="w-[250px]">Pharmacy</TableHead>
            <TableHead>Address</TableHead>
            <TableHead>Services</TableHead>
            <TableHead>Delivery</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredPharmacies.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                {searchTerm ? "No pharmacies found matching your search" : "No pharmacies found"}
              </TableCell>
            </TableRow>
          ) : (
            filteredPharmacies.map((pharmacy) => (
              <TableRow key={pharmacy.id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{pharmacy.name}</div>
                    <div className="text-xs text-muted-foreground">{pharmacy.phone}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{pharmacy.address || 'No address provided'}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm max-w-[200px] truncate">{pharmacy.services || 'Standard pharmacy services'}</div>
                </TableCell>
                <TableCell>
                  {pharmacy.delivery_available ? (
                    <Badge variant="outline" className="border-green-500 text-green-500">
                      <Check className="h-3 w-3 mr-1" /> Available
                    </Badge>
                  ) : (
                    <Badge variant="secondary">
                      <X className="h-3 w-3 mr-1" /> Not Available
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={pharmacy.status === "active" ? "outline" : "secondary"} className={pharmacy.status === "active" ? "border-green-500 text-green-500" : ""}>
                    {pharmacy.status || 'Pending'}
                  </Badge>
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

export default PharmaciesList;
